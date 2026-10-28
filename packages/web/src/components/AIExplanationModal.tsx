import React, { useState, useEffect } from 'react';
import {
  AIProviderType,
  AIProviderConfig,
  ExplanationRequest,
  ExplanationResponse,
  ExplanationEngine,
  ModelDownloadProgress,
  WebGPUExplanationProvider
} from '@gitxray/core';

interface AIExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestContext?: ExplanationRequest | null;
}

const STORAGE_KEY_CONFIG = 'gitxray_ai_config_v1';
const STORAGE_KEY_GEMINI = 'gitxray_ai_key_gemini';
const STORAGE_KEY_GROQ = 'gitxray_ai_key_groq';

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  isOpen,
  onClose,
  requestContext
}) => {
  const [provider, setProvider] = useState<AIProviderType>('template');
  const [enabled, setEnabled] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<ModelDownloadProgress | null>(null);
  const [response, setResponse] = useState<ExplanationResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'settings'>('explanation');

  const webGpuSupported = WebGPUExplanationProvider.isWebGPUSupported();

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setProvider(parsed.provider || 'template');
        setEnabled(!!parsed.enabled);
      }
      const savedGemini = localStorage.getItem(STORAGE_KEY_GEMINI);
      if (savedGemini) setGeminiKey(savedGemini);
      const savedGroq = localStorage.getItem(STORAGE_KEY_GROQ);
      if (savedGroq) setGroqKey(savedGroq);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveConfig = (newProvider: AIProviderType, newEnabled: boolean) => {
    setProvider(newProvider);
    setEnabled(newEnabled);
    try {
      localStorage.setItem(
        STORAGE_KEY_CONFIG,
        JSON.stringify({ provider: newProvider, enabled: newEnabled })
      );
    } catch {}
  };

  const handleGeminiKeyChange = (val: string) => {
    setGeminiKey(val);
    try {
      localStorage.setItem(STORAGE_KEY_GEMINI, val);
    } catch {}
  };

  const handleGroqKeyChange = (val: string) => {
    setGroqKey(val);
    try {
      localStorage.setItem(STORAGE_KEY_GROQ, val);
    } catch {}
  };

  const runExplanation = async () => {
    if (!requestContext) return;
    setIsLoading(true);
    setResponse(null);
    setDownloadProgress(null);

    const config: AIProviderConfig = {
      provider,
      enabled,
      apiKey: provider === 'gemini' ? geminiKey : provider === 'groq' ? groqKey : undefined
    };

    try {
      const result = await ExplanationEngine.explain(
        requestContext,
        config,
        (progress) => setDownloadProgress(progress)
      );
      setResponse(result);
    } catch (err: any) {
      setResponse({
        provider: 'template',
        model: 'fallback',
        explanation: `Failed to fetch explanation: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && requestContext) {
      runExplanation();
    }
  }, [isOpen, requestContext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧠</span>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                Socratic AI Explanations
              </h2>
              <p className="text-xs text-slate-400">
                Guiding concepts & invariants without spoiling solutions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setActiveTab('explanation')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'explanation'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Advice
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'settings'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Settings
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'settings' ? (
            <div className="space-y-6">
              {/* Toggle switch */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
                <div>
                  <h4 className="text-sm font-medium text-white">Enable Enhanced AI</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Off by default. When disabled, fast deterministic template heuristics are used.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => saveConfig(provider, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              {/* Provider Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Provider
                </label>

                {/* Option 1: Template Heuristics */}
                <div
                  onClick={() => saveConfig('template', enabled)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    provider === 'template'
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Deterministic Heuristics (Offline)</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
                      0MB • Fast
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Zero downloads, no API keys, completely private AST and structural reasoning.
                  </p>
                </div>

                {/* Option 2: WebGPU */}
                <div
                  onClick={() => webGpuSupported && saveConfig('webgpu', enabled)}
                  className={`p-3.5 rounded-lg border transition-all ${
                    !webGpuSupported
                      ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                      : provider === 'webgpu'
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/30 cursor-pointer'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Local AI via WebGPU</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 font-mono">
                      {webGpuSupported ? 'WebGPU Ready' : 'WebGPU Unavailable'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Quantized 0.5B instruct model cached in browser via Transformers.js. 100% private.
                  </p>
                </div>

                {/* Option 3: Gemini BYOK */}
                <div
                  onClick={() => saveConfig('gemini', enabled)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    provider === 'gemini'
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Google Gemini (BYOK)</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-950/80 text-purple-400 border border-purple-800/60 font-mono">
                      Cloud • Free Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Bring your own Gemini API key. Stored only in local browser storage.
                  </p>
                  {provider === 'gemini' && (
                    <div className="mt-3">
                      <input
                        type="password"
                        placeholder="Paste Gemini API Key (AIza...)"
                        value={geminiKey}
                        onChange={(e) => handleGeminiKeyChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 px-3 py-2 rounded focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Option 4: Groq BYOK */}
                <div
                  onClick={() => saveConfig('groq', enabled)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    provider === 'groq'
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Groq Llama 3.1 (BYOK)</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-800/60 font-mono">
                      Fast Cloud
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Bring your own Groq API key. Stored only in local browser storage.
                  </p>
                  {provider === 'groq' && (
                    <div className="mt-3">
                      <input
                        type="password"
                        placeholder="Paste Groq API Key (gsk_...)"
                        value={groqKey}
                        onChange={(e) => handleGroqKeyChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 px-3 py-2 rounded focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress UI for WebGPU model download */}
              {downloadProgress && (
                <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg">
                  <div className="flex items-center justify-between text-xs text-blue-300 mb-1">
                    <span>Downloading local model: {downloadProgress.file || 'weights'}</span>
                    <span>{downloadProgress.progress ?? 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress.progress ?? 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400 font-mono">Analyzing codebase invariants...</p>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  {/* Model Tag */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
                    <span>Provider: <strong className="text-slate-200">{response.provider}</strong></span>
                    <span>Model: <strong className="text-slate-200">{response.model}</strong></span>
                  </div>

                  {/* Main Explanation Body */}
                  <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                    {response.explanation}
                  </div>

                  {/* Guiding Socratic Questions */}
                  {response.guidingQuestions && response.guidingQuestions.length > 0 && (
                    <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-lg space-y-2">
                      <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                        <span>🤔</span> Guiding Questions
                      </h4>
                      <ul className="space-y-1.5">
                        {response.guidingQuestions.map((q, idx) => (
                          <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Invariants */}
                  {response.keyInvariants && response.keyInvariants.length > 0 && (
                    <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-2">
                      <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                        <span>🛡️</span> Key Architectural Invariants
                      </h4>
                      <ul className="space-y-1.5">
                        {response.keyInvariants.map((inv, idx) => (
                          <li key={idx} className="text-xs text-emerald-200/90 flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{inv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No active context to explain. Select a file or milestone.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            GitXray Socratic AI • Keys stored in browser only • Non-evaluative
          </span>
          <div className="flex items-center gap-2">
            {activeTab === 'explanation' && (
              <button
                onClick={runExplanation}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
              >
                Regenerate
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
