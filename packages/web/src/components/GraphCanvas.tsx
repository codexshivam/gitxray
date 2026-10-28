import React, { useRef, useEffect, useState, useMemo } from 'react';
import { CoreGraphNode, CoreGraphEdge, RankedFileNode } from '@gitxray/core';
import { ZoomIn, ZoomOut, Maximize2, Sliders } from 'lucide-react';

interface SimulationNode {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  score: number;
  rank: number;
  isCore: boolean;
  language: string;
}

interface GraphCanvasProps {
  nodes: CoreGraphNode[];
  edges: CoreGraphEdge[];
  rankedFiles: RankedFileNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  maxNodes?: number;
  onMaxNodesChange?: (limit: number) => void;
}

export function GraphCanvas({
  nodes,
  edges,
  rankedFiles,
  selectedNodeId,
  onSelectNode,
  maxNodes = 20,
  onMaxNodesChange
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Transform state (Pan and Zoom)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const isDraggingCanvasRef = useRef(false);
  const draggedNodeRef = useRef<SimulationNode | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Map rankings for quick lookup
  const rankMap = useMemo(() => {
    const map = new Map<string, { rank: number; score: number; isCore: boolean }>();
    const total = rankedFiles.length;
    rankedFiles.forEach((rf, idx) => {
      map.set(rf.id, {
        rank: idx + 1,
        score: rf.score,
        isCore: !rf.isBoilerplate && idx < Math.max(3, Math.ceil(total * 0.2))
      });
    });
    return map;
  }, [rankedFiles]);

  // Filter to Top-N ranked nodes
  const { filteredNodes, filteredEdges } = useMemo(() => {
    const topPaths = new Set(
      rankedFiles.slice(0, maxNodes).map((r) => r.id)
    );

    // If no ranked files, fallback to first N nodes
    if (topPaths.size === 0) {
      nodes.slice(0, maxNodes).forEach((n) => topPaths.add(n.id));
    }

    const n = nodes.filter((node) => topPaths.has(node.id));
    const e = edges.filter(
      (edge) => topPaths.has(edge.source) && topPaths.has(edge.target)
    );

    return { filteredNodes: n, filteredEdges: e };
  }, [nodes, edges, rankedFiles, maxNodes]);

  // Initialize simulation positions
  const simNodesRef = useRef<Map<string, SimulationNode>>(new Map());

  useEffect(() => {
    const simMap = simNodesRef.current;
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    const cx = width / 2;
    const cy = height / 2;

    const currentIds = new Set(filteredNodes.map((n) => n.id));

    // Remove nodes that are no longer present
    for (const id of simMap.keys()) {
      if (!currentIds.has(id)) {
        simMap.delete(id);
      }
    }

    // Add or update nodes
    filteredNodes.forEach((node, idx) => {
      const rankInfo = rankMap.get(node.id) || {
        rank: idx + 1,
        score: 0.1,
        isCore: idx < 3
      };

      if (!simMap.has(node.id)) {
        const angle = (idx / Math.max(1, filteredNodes.length)) * 2 * Math.PI;
        const radius = 100 + (idx % 3) * 60;
        simMap.set(node.id, {
          id: node.id,
          name: node.id.split('/').pop() || node.id,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          radius: rankInfo.isCore ? 18 : 12,
          score: rankInfo.score,
          rank: rankInfo.rank,
          isCore: rankInfo.isCore,
          language: node.language
        });
      } else {
        const existing = simMap.get(node.id)!;
        existing.rank = rankInfo.rank;
        existing.score = rankInfo.score;
        existing.isCore = rankInfo.isCore;
        existing.radius = rankInfo.isCore ? 18 : 12;
      }
    });
  }, [filteredNodes, rankMap]);

  // Force simulation loop & rendering
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const runSimulationStep = () => {
      const simMap = simNodesRef.current;
      const simNodes = Array.from(simMap.values());
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const cx = width / 2;
      const cy = height / 2;

      // 1. Repulsion between nodes (Coulomb force)
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const a = simNodes[i];
          const b = simNodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(distSq);
          const force = 3000 / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (a !== draggedNodeRef.current) {
            a.vx -= fx;
            a.vy -= fy;
          }
          if (b !== draggedNodeRef.current) {
            b.vx += fx;
            b.vy += fy;
          }
        }
      }

      // 2. Spring attraction along edges (Hooke's force)
      filteredEdges.forEach((edge) => {
        const src = simMap.get(edge.source);
        const tgt = simMap.get(edge.target);
        if (!src || !tgt) return;

        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 120;
        const springForce = (dist - targetDist) * 0.035;
        const fx = (dx / dist) * springForce;
        const fy = (dy / dist) * springForce;

        if (src !== draggedNodeRef.current) {
          src.vx += fx;
          src.vy += fy;
        }
        if (tgt !== draggedNodeRef.current) {
          tgt.vx -= fx;
          tgt.vy -= fy;
        }
      });

      // 3. Center gravity force & damping
      simNodes.forEach((node) => {
        if (node === draggedNodeRef.current) return;
        const cdx = cx - node.x;
        const cdy = cy - node.y;
        node.vx += cdx * 0.005;
        node.vy += cdy * 0.005;

        // Damping velocity
        node.vx *= 0.88;
        node.vy *= 0.88;

        node.x += node.vx;
        node.y += node.vy;
      });
    };

    const render = () => {
      runSimulationStep();

      const dpr = window.devicePixelRatio || 1;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // Apply Pan and Zoom
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      const simMap = simNodesRef.current;

      // Draw Edges
      filteredEdges.forEach((edge) => {
        const src = simMap.get(edge.source);
        const tgt = simMap.get(edge.target);
        if (!src || !tgt) return;

        const isHighlighted =
          edge.source === selectedNodeId ||
          edge.target === selectedNodeId ||
          edge.source === hoveredNodeId ||
          edge.target === hoveredNodeId;

        const isDimmed =
          (selectedNodeId || hoveredNodeId) && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 8;
        } else if (isDimmed) {
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();

        // Draw arrow head pointing to target
        const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
        const arrowDist = tgt.radius + 6;
        const ax = tgt.x - Math.cos(angle) * arrowDist;
        const ay = tgt.y - Math.sin(angle) * arrowDist;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(
          ax - 8 * Math.cos(angle - Math.PI / 7),
          ay - 8 * Math.sin(angle - Math.PI / 7)
        );
        ctx.lineTo(
          ax - 8 * Math.cos(angle + Math.PI / 7),
          ay - 8 * Math.sin(angle + Math.PI / 7)
        );
        ctx.closePath();
        ctx.fillStyle = isHighlighted ? '#06b6d4' : isDimmed ? 'rgba(51, 65, 85, 0.3)' : '#64748b';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      simMap.forEach((node) => {
        const isSelected = node.id === selectedNodeId;
        const isHovered = node.id === hoveredNodeId;
        const isCore = node.isCore;

        ctx.save();

        // Halo Glow for Core Gravity Wells or Selected Nodes
        if (isSelected || isCore || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + (isSelected ? 10 : 6), 0, 2 * Math.PI);
          ctx.fillStyle = isSelected
            ? 'rgba(6, 182, 212, 0.35)'
            : isCore
            ? 'rgba(16, 185, 129, 0.25)'
            : 'rgba(56, 189, 248, 0.2)';
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected
          ? '#06b6d4'
          : isCore
          ? '#059669'
          : '#1e293b';
        ctx.fill();

        ctx.strokeStyle = isSelected
          ? '#ffffff'
          : isCore
          ? '#10b981'
          : '#475569';
        ctx.lineWidth = isSelected ? 3 : isCore ? 2 : 1.5;
        ctx.stroke();

        // Node Inner Icon / Dot for gravity well
        if (isCore) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }

        // Rank Badge above node
        if (node.rank <= 5) {
          ctx.font = 'bold 9px ui-monospace, monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText(`#${node.rank}`, node.x, node.y - node.radius - 6);
        }

        // Label below node
        ctx.font = `${isSelected || isHovered ? 'bold 11px' : '10px'} ui-monospace, SFMono-Regular, monospace`;
        ctx.fillStyle = isSelected ? '#38bdf8' : isHovered ? '#f1f5f9' : '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.radius + 14);

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [filteredEdges, transform, selectedNodeId, hoveredNodeId]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to find node under client coordinates
  const getNodeAtCoords = (clientX: number, clientY: number): SimulationNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - transform.x) / transform.scale;
    const y = (clientY - rect.top - transform.y) / transform.scale;

    for (const node of simNodesRef.current.values()) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (dx * dx + dy * dy <= (node.radius + 8) * (node.radius + 8)) {
        return node;
      }
    }
    return null;
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const clickedNode = getNodeAtCoords(e.clientX, e.clientY);
    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      onSelectNode(clickedNode.id);
    } else {
      isDraggingCanvasRef.current = true;
    }
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x += dx / transform.scale;
      draggedNodeRef.current.y += dy / transform.scale;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
    } else if (isDraggingCanvasRef.current) {
      setTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy
      }));
    } else {
      const node = getNodeAtCoords(e.clientX, e.clientY);
      setHoveredNodeId(node ? node.id : null);
    }
  };

  const handleMouseUp = () => {
    isDraggingCanvasRef.current = false;
    draggedNodeRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform((prev) => {
      const newScale = Math.min(Math.max(0.2, prev.scale * zoomFactor), 3.0);
      return {
        ...prev,
        scale: newScale
      };
    });
  };

  const handleAutoCenter = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] flex-1 overflow-hidden bg-brand-dark select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-brand-surface/90 border border-brand-border rounded-lg p-1.5 backdrop-blur-md shadow-xl text-slate-300">
        <button
          onClick={() => setTransform((p) => ({ ...p, scale: Math.min(3, p.scale * 1.2) }))}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.2, p.scale * 0.8) }))}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleAutoCenter}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          title="Auto Center"
        >
          <Maximize2 size={16} />
        </button>

        {onMaxNodesChange && (
          <div className="flex items-center gap-2 pl-2 border-l border-brand-border text-xs">
            <Sliders size={14} className="text-slate-400" />
            <span className="text-slate-400">Top Nodes:</span>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxNodes}
              onChange={(e) => onMaxNodesChange(Number(e.target.value))}
              className="w-20 accent-brand-cyan cursor-pointer"
            />
            <span className="font-mono text-brand-cyan">{maxNodes}</span>
          </div>
        )}
      </div>

      {/* Legend Card */}
      <div className="absolute top-4 left-4 bg-brand-surface/85 border border-brand-border rounded-lg p-2.5 backdrop-blur-md text-xs space-y-1.5 pointer-events-none shadow-lg">
        <div className="font-medium text-slate-300">Graph Architecture</div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span>Core Gravity Well (Top PageRank)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500" />
          <span>Supporting Module</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-4 h-0.5 bg-cyan-500" />
          <span>Dependency Import Flow</span>
        </div>
      </div>
    </div>
  );
}
