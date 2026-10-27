import { ARCHITECTURE_VAULT } from './vault_data.js';

export const REPO_BLUEPRINTS = {
  'openai/whisper': {
    name: 'OpenAI Whisper',
    stars: '111k',
    language: 'Python',
    description: 'Robust Speech Recognition via Large-Scale Weak Supervision (Encoder-Decoder Transformer)',
    gravityWell: 'whisper/model.py',
    files: [
      { path: 'whisper/model.py', lines: 353, type: 'core', desc: 'AudioEncoder and TextDecoder Transformer architecture' },
      { path: 'whisper/transcribe.py', lines: 480, type: 'core', desc: 'High-level transcription pipeline with sliding window' },
      { path: 'whisper/audio.py', lines: 175, type: 'input', desc: 'Log-Mel Spectrogram feature extraction and audio resampling' },
      { path: 'whisper/decoding.py', lines: 520, type: 'core', desc: 'Autoregressive greedy and beam search token decoding' },
      { path: 'whisper/timing.py', lines: 210, type: 'utility', desc: 'Dynamic time warping (DTW) word-level timestamp alignment' },
      { path: 'whisper/tokenizer.py', lines: 190, type: 'utility', desc: 'Byte-pair encoding (BPE) multi-lingual vocabulary encoder' },
      { path: 'whisper/utils.py', lines: 120, type: 'utility', desc: 'Formatting and subtitle export helpers (SRT, VTT)' },
      { path: 'whisper/triton_ops.py', lines: 140, type: 'engine', desc: 'GPU-accelerated custom Triton matrix kernels' },
      { path: 'tests/test_audio.py', lines: 85, type: 'test', desc: 'Audio loading and padding unit tests' },
      { path: 'tests/test_transcribe.py', lines: 95, type: 'test', desc: 'End-to-end model inference regression fixtures' }
    ],
    edges: [
      ['whisper/transcribe.py', 'whisper/model.py'],
      ['whisper/transcribe.py', 'whisper/audio.py'],
      ['whisper/transcribe.py', 'whisper/decoding.py'],
      ['whisper/transcribe.py', 'whisper/tokenizer.py'],
      ['whisper/decoding.py', 'whisper/model.py'],
      ['whisper/decoding.py', 'whisper/tokenizer.py'],
      ['whisper/timing.py', 'whisper/model.py'],
      ['whisper/model.py', 'whisper/triton_ops.py'],
      ['whisper/transcribe.py', 'whisper/utils.py'],
      ['tests/test_transcribe.py', 'whisper/transcribe.py'],
      ['tests/test_audio.py', 'whisper/audio.py']
    ],
    executionTrace: [
      {
        file: 'whisper/audio.py',
        line: 42,
        fn: 'load_audio',
        type: 'call',
        payload: { input: 'audio.wav', targetSr: 16000 },
        stateChanges: { sampleRate: 16000, durationSec: 12.4, status: 'LOADED_PCM' },
        explanation: '1. Reads input audio file into memory and resamples audio waveform to standard 16,000 Hz single-channel PCM.'
      },
      {
        file: 'whisper/audio.py',
        line: 112,
        fn: 'log_mel_spectrogram',
        type: 'call',
        payload: { n_mels: 80, n_fft: 400, hop_length: 160 },
        stateChanges: { melMatrix: 'Tensor([80, 3000])', featureDim: 80, status: 'SPECTROGRAM_READY' },
        explanation: '2. Computes 80-channel log-Mel spectrogram features using Hanning window FFT frames.'
      },
      {
        file: 'whisper/model.py',
        line: 165,
        fn: 'AudioEncoder.forward',
        type: 'call',
        payload: { mel: '[80, 3000]', layers: 6, d_model: 512 },
        stateChanges: { encoderHiddenStates: 'Tensor([1500, 512])', convDownsampled: 2 },
        explanation: '3. Passes Mel spectrogram through two 1D convolutions followed by 6 Transformer encoder blocks with self-attention.'
      },
      {
        file: 'whisper/decoding.py',
        line: 230,
        fn: 'DecodingTask.run',
        type: 'call',
        payload: { beam_size: 5, temperature: 0.0, language: 'en' },
        stateChanges: { emittedTokens: [50258, 50259, 50359, 2420, 318, 257], step: 6 },
        explanation: '4. Autoregressive TextDecoder performs cross-attention over encoder states, sampling next-token probabilities.'
      },
      {
        file: 'whisper/tokenizer.py',
        line: 78,
        fn: 'Tokenizer.decode',
        type: 'return',
        payload: { tokenIds: [2420, 318, 257, 1820], result: 'Speech recognition completed.' },
        stateChanges: { transcript: 'Speech recognition completed.', status: 'FINISHED' },
        explanation: '5. Converts output token IDs into final UTF-8 text string with punctuation and word timestamps.'
      }
    ],
    stages: [
      {
        stage: 0,
        name: 'The Core Loop: AudioEncoder & TextDecoder Kernel',
        objective: 'Implement the minimal synchronous PyTorch forward pass connecting Mel inputs to decoder output logits.',
        targetFile: 'whisper/model.py',
        code: `import torch\nimport torch.nn as nn\n\nclass WhisperKernel(nn.Module):\n    def __init__(self, d_model=512, n_mels=80, vocab_size=51865):\n        super().__init__()\n        self.encoder = nn.Linear(n_mels, d_model)\n        self.decoder = nn.Linear(d_model, vocab_size)\n\n    def forward(self, mel, tokens):\n        # Step 1: Encode Mel frames\n        hidden = self.encoder(mel.transpose(-1, -2))\n        # Step 2: Decode token logits\n        logits = self.decoder(hidden)\n        return logits\n`
      },
      {
        stage: 1,
        name: 'Log-Mel Spectrogram Extraction',
        objective: 'Compute 80-channel logarithmic Mel filterbanks from 16kHz audio waveforms.',
        targetFile: 'whisper/audio.py',
        code: `import torch\n\ndef log_mel_spectrogram(audio, n_mels=80):\n    window = torch.hann_window(400)\n    stft = torch.stft(audio, 400, 160, window=window, return_complex=True)\n    magnitudes = stft[..., :-1].abs() ** 2\n    return torch.log10(torch.clamp(magnitudes, min=1e-10))\n`
      },
      {
        stage: 2,
        name: 'Byte-Pair Encoding (BPE) Tokenizer',
        objective: 'Implement byte-level vocab encoding and decoding tables.',
        targetFile: 'whisper/tokenizer.py',
        code: `class Tokenizer:\n    def __init__(self, vocab):\n        self.vocab = vocab\n        self.inverse_vocab = {v: k for k, v in vocab.items()}\n\n    def decode(self, tokens):\n        return "".join([self.inverse_vocab.get(t, "") for t in tokens])\n`
      },
      {
        stage: 3,
        name: 'Autoregressive Greedy & Beam Search',
        objective: 'Implement temperature-based token sampling and beam search stopping criteria.',
        targetFile: 'whisper/decoding.py',
        code: `def greedy_decode(model, mel, max_tokens=100):\n    tokens = [50258]\n    for _ in range(max_tokens):\n        logits = model(mel, tokens)\n        next_token = logits.argmax(dim=-1)[-1].item()\n        tokens.append(next_token)\n        if next_token == 50257: break\n    return tokens\n`
      },
      {
        stage: 4,
        name: 'Sliding Window Audio Chunking',
        objective: 'Add 30-second window segmenting for continuous long-form audio files.',
        targetFile: 'whisper/transcribe.py',
        code: `def chunk_audio(audio, chunk_length=30 * 16000):\n    for i in range(0, len(audio), chunk_length):\n        yield audio[i:i + chunk_length]\n`
      }
    ]
  },
  'facebook/react': {
    name: 'Facebook React',
    stars: '235k',
    language: 'JavaScript',
    description: 'Concurrent declarative UI component reconciler and virtual DOM scheduler',
    gravityWell: 'packages/react-reconciler/src/ReactFiberWorkLoop.js',
    files: [
      { path: 'packages/react-reconciler/src/ReactFiberWorkLoop.js', lines: 1800, type: 'core', desc: 'Concurrent fiber reconciliation work loop and commit phase' },
      { path: 'packages/react/src/React.js', lines: 140, type: 'api', desc: 'Public top-level API (createElement, useState, useEffect)' },
      { path: 'packages/react-reconciler/src/ReactFiber.js', lines: 420, type: 'core', desc: 'Fiber node data structure and tag allocations' },
      { path: 'packages/react-reconciler/src/ReactFiberHooks.js', lines: 1100, type: 'core', desc: 'Hook state linked-list dispatch and reconciliation' },
      { path: 'packages/scheduler/src/forks/Scheduler.js', lines: 650, type: 'engine', desc: 'MessageChannel cooperative time-slicing scheduler' },
      { path: 'packages/react-dom/src/client/ReactDOM.js', lines: 320, type: 'renderer', desc: 'Host DOM element creation, attribute mutation, and event delegation' }
    ],
    edges: [
      ['packages/react/src/React.js', 'packages/react-reconciler/src/ReactFiber.js'],
      ['packages/react-reconciler/src/ReactFiberWorkLoop.js', 'packages/react-reconciler/src/ReactFiber.js'],
      ['packages/react-reconciler/src/ReactFiberWorkLoop.js', 'packages/react-reconciler/src/ReactFiberHooks.js'],
      ['packages/react-reconciler/src/ReactFiberWorkLoop.js', 'packages/scheduler/src/forks/Scheduler.js'],
      ['packages/react-dom/src/client/ReactDOM.js', 'packages/react-reconciler/src/ReactFiberWorkLoop.js']
    ],
    executionTrace: [
      {
        file: 'packages/react/src/React.js',
        line: 25,
        fn: 'createElement',
        type: 'call',
        payload: { type: 'div', props: { className: 'app' } },
        stateChanges: { vnodeCreated: true, type: 'div' },
        explanation: '1. Constructs a ReactElement representation with type, props, and key.'
      },
      {
        file: 'packages/scheduler/src/forks/Scheduler.js',
        line: 82,
        fn: 'scheduleCallback',
        type: 'call',
        payload: { priority: 'NormalPriority', timeout: 5000 },
        stateChanges: { taskScheduled: true, deadlineRemainingMs: 4.8 },
        explanation: '2. Enqueues a render task in the cooperative time-slicing min-heap.'
      },
      {
        file: 'packages/react-reconciler/src/ReactFiberWorkLoop.js',
        line: 340,
        fn: 'performUnitOfWork',
        type: 'call',
        payload: { fiberTag: 'HostComponent', lane: 1 },
        stateChanges: { workInProgress: 'FiberNode(div)', subTreeFlags: 0 },
        explanation: '3. Traverses the fiber tree, computing state hooks and child element diffs.'
      },
      {
        file: 'packages/react-dom/src/client/ReactDOM.js',
        line: 120,
        fn: 'commitMutationEffects',
        type: 'return',
        payload: { domNode: 'HTMLDivElement', op: 'appendChild' },
        stateChanges: { domCommitted: true, phase: 'IDLE' },
        explanation: '4. Commits visual mutations directly into browser DOM in a single atomic pass.'
      }
    ],
    stages: [
      {
        stage: 0,
        name: 'Fiber Node & Cooperative Work Loop',
        objective: 'Implement a non-blocking while loop that yields execution when frame deadline expires.',
        targetFile: 'packages/react-reconciler/src/ReactFiberWorkLoop.js',
        code: `export function workLoopConcurrent(workInProgress, shouldYield) {\n  while (workInProgress !== null && !shouldYield()) {\n    workInProgress = performUnitOfWork(workInProgress);\n  }\n  return workInProgress;\n}`
      },
      {
        stage: 1,
        name: 'Virtual DOM Diffing & Reconciler',
        objective: 'Construct the tree diffing algorithm comparing old and new fiber children.',
        targetFile: 'packages/react-reconciler/src/ReactChildFiber.js',
        code: `export function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {\n  if (currentFirstChild && currentFirstChild.key === newChild.key) {\n    return cloneFiber(currentFirstChild, newChild.props);\n  }\n  return createFiberFromElement(newChild);\n}`
      }
    ]
  },
  'openclaw/openclaw': {
    name: 'OpenClaw',
    stars: '393k',
    language: 'TypeScript',
    description: 'Cross-platform autonomous agent orchestration and execution runtime',
    gravityWell: 'src/agent/loop.ts',
    files: [
      { path: 'src/agent/loop.ts', lines: 340, type: 'core', desc: 'Central autonomous perception-action loop and state coordinator' },
      { path: 'src/engine/dispatch.ts', lines: 210, type: 'core', desc: 'Action routing and tool execution pipeline' },
      { path: 'src/parser/ast.ts', lines: 180, type: 'engine', desc: 'Codebase AST parsing and symbol graph extraction' },
      { path: 'src/storage/db.ts', lines: 140, type: 'storage', desc: 'Local session and memory vector store' },
      { path: 'src/tools/shell.ts', lines: 110, type: 'tool', desc: 'Sandboxed command execution and stdout capturing' }
    ],
    edges: [
      ['src/agent/loop.ts', 'src/engine/dispatch.ts'],
      ['src/agent/loop.ts', 'src/storage/db.ts'],
      ['src/engine/dispatch.ts', 'src/tools/shell.ts'],
      ['src/engine/dispatch.ts', 'src/parser/ast.ts']
    ],
    executionTrace: [
      {
        file: 'src/agent/loop.ts',
        line: 18,
        fn: 'runAgentLoop',
        type: 'call',
        payload: { objective: 'Decompile codebase architecture', step: 1 },
        stateChanges: { loopActive: true, status: 'PERCEIVING' },
        explanation: '1. Initializes agent context and evaluates current workspace state.'
      },
      {
        file: 'src/parser/ast.ts',
        line: 45,
        fn: 'extractSyntaxTree',
        type: 'call',
        payload: { target: 'src/agent/loop.ts', parser: 'tree-sitter' },
        stateChanges: { astExtracted: true, nodesCount: 142 },
        explanation: '2. Builds concrete syntax tree in memory to map function signatures.'
      },
      {
        file: 'src/engine/dispatch.ts',
        line: 32,
        fn: 'dispatchTool',
        type: 'call',
        payload: { tool: 'inspect_symbols', exitCode: 0 },
        stateChanges: { step: 2, actionExecuted: true },
        explanation: '3. Dispatches sandboxed tool execution and validates output contract.'
      },
      {
        file: 'src/agent/loop.ts',
        line: 95,
        fn: 'runAgentLoop',
        type: 'return',
        payload: { completed: true },
        stateChanges: { status: 'SUCCESS' },
        explanation: '4. Verifies objective completion and updates state storage.'
      }
    ],
    stages: [
      {
        stage: 0,
        name: 'The Agent Execution Kernel',
        objective: 'Construct the continuous while-loop dispatching actions until the goal is satisfied.',
        targetFile: 'src/agent/loop.ts',
        code: `export async function runAgentLoop(task, tools) {\n  let completed = false;\n  while (!completed) {\n    const action = await tools.planNext(task);\n    if (action.type === 'finish') break;\n    await tools.execute(action);\n  }\n  return { status: 'complete' };\n}`
      }
    ]
  }
};

export async function fetchLiveRepository(repoSlug) {
  const parts = repoSlug.split('/').filter(Boolean);
  if (parts.length < 2) throw new Error('Repository slug must be in owner/repo format');
  const owner = parts[0];
  const repo = parts[1];
  const slug = `${owner}/${repo}`;

  if (REPO_BLUEPRINTS[slug]) {
    return { ...REPO_BLUEPRINTS[slug], source: 'blueprint', slug };
  }

  try {
    const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (metaRes.status === 403) {
      console.warn('GitHub API rate limit hit, using dynamic semantic synthesis.');
      return generateSyntheticBlueprint(slug, owner, repo);
    }
    if (!metaRes.ok) {
      return generateSyntheticBlueprint(slug, owner, repo);
    }
    const meta = await metaRes.json();
    const branch = meta.default_branch || 'main';

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    if (!treeRes.ok) {
      return generateSyntheticBlueprint(slug, owner, repo, meta);
    }
    const treeData = await treeRes.json();
    const allFiles = (treeData.tree || [])
      .filter(item => item.type === 'blob')
      .map(item => item.path);

    const codeExts = ['.py', '.js', '.ts', '.jsx', '.tsx', '.rs', '.go', '.c', '.cpp', '.h', '.java'];
    const codeFiles = allFiles.filter(f => codeExts.some(ext => f.endsWith(ext)));

    const selectedFiles = codeFiles.slice(0, 30);
    if (selectedFiles.length === 0) {
      return generateSyntheticBlueprint(slug, owner, repo, meta);
    }

    const files = selectedFiles.map((p, idx) => ({
      path: p,
      lines: Math.floor(Math.random() * 400) + 50,
      type: idx === 0 ? 'core' : (idx < 5 ? 'engine' : 'utility'),
      desc: `Source module for ${p.split('/').pop()}`
    }));

    const edges = [];
    const gravityWell = selectedFiles[0];
    for (let i = 1; i < selectedFiles.length; i++) {
      if (i <= 4) {
        edges.push([selectedFiles[i], gravityWell]);
      } else {
        const target = selectedFiles[i % 4];
        edges.push([selectedFiles[i], target]);
      }
    }

    return {
      name: repo,
      slug,
      stars: formatStars(meta.stargazers_count),
      language: meta.language || 'Unknown',
      description: meta.description || 'Open-source software repository',
      gravityWell,
      files,
      edges,
      source: 'live-github',
      branch,
      executionTrace: generateGenericTrace(gravityWell, files),
      stages: generateGenericStages(gravityWell, meta.language || 'TypeScript')
    };
  } catch (err) {
    return generateSyntheticBlueprint(slug, owner, repo);
  }
}

function formatStars(count) {
  if (!count) return '1k';
  if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
  return `${count}`;
}

function generateSyntheticBlueprint(slug, owner, repo, meta = {}) {
  const vaultMatch = ARCHITECTURE_VAULT.find(v => v.repo.toLowerCase() === slug.toLowerCase());
  const lang = meta.language || vaultMatch?.language || 'TypeScript';
  const desc = meta.description || vaultMatch?.stage0Summary || 'Live deconstructed open-source architecture';
  const gravityWell = vaultMatch?.gravityWell || `src/${repo.toLowerCase()}_core.${lang === 'Python' ? 'py' : lang === 'Go' ? 'go' : lang === 'Rust' ? 'rs' : 'ts'}`;

  const ext = lang === 'Python' ? '.py' : lang === 'Go' ? '.go' : lang === 'Rust' ? '.rs' : '.ts';
  const samplePaths = [
    gravityWell,
    `src/dispatch${ext}`,
    `src/parser${ext}`,
    `src/state${ext}`,
    `src/engine${ext}`,
    `src/utils${ext}`,
    `src/storage${ext}`
  ];

  const files = samplePaths.map((p, idx) => ({
    path: p,
    lines: Math.floor(Math.random() * 300) + 60,
    type: idx === 0 ? 'core' : 'module',
    desc: `${p.split('/').pop()} operational module`
  }));

  const edges = [
    [samplePaths[1], gravityWell],
    [samplePaths[2], gravityWell],
    [samplePaths[3], gravityWell],
    [samplePaths[4], samplePaths[1]],
    [samplePaths[5], samplePaths[3]],
    [samplePaths[6], samplePaths[3]]
  ];

  return {
    name: repo,
    slug,
    stars: meta.stargazers_count ? formatStars(meta.stargazers_count) : (vaultMatch?.stars || '10k'),
    language: lang,
    description: desc,
    gravityWell,
    files,
    edges,
    source: 'synthesized',
    executionTrace: generateGenericTrace(gravityWell, files),
    stages: generateGenericStages(gravityWell, lang)
  };
}

function generateGenericTrace(gravityWell, files) {
  const f2 = files[1]?.path || files[0].path;
  const f3 = files[2]?.path || files[0].path;
  return [
    {
      file: gravityWell,
      line: 12,
      fn: 'initEngine',
      type: 'call',
      payload: { mode: 'INITIALIZE', config: 'default' },
      stateChanges: { engineReady: true, status: 'BOOT' },
      explanation: `1. Entry point invoked in ${gravityWell}; initializes configuration parameters.`
    },
    {
      file: f2,
      line: 38,
      fn: 'parseInput',
      type: 'call',
      payload: { input: 'payload_stream', bytes: 2048 },
      stateChanges: { tokens: 42, parsed: true },
      explanation: `2. Delegates parsing and schema validation to ${f2}.`
    },
    {
      file: f3,
      line: 64,
      fn: 'executePipeline',
      type: 'call',
      payload: { batchSize: 16 },
      stateChanges: { state: 'PROCESSING', frame: 1 },
      explanation: `3. Processes batch units across execution queue in ${f3}.`
    },
    {
      file: gravityWell,
      line: 85,
      fn: 'initEngine',
      type: 'return',
      payload: { status: 'SUCCESS' },
      stateChanges: { status: 'COMPLETED' },
      explanation: `4. Completes execution cycle and returns deterministic response.`
    }
  ];
}

function generateGenericStages(gravityWell, lang) {
  return [
    {
      stage: 0,
      name: 'The Foundational Kernel (<80 LOC)',
      objective: `Construct the minimal core loop in ${gravityWell}.`,
      targetFile: gravityWell,
      code: `// Stage 0: Minimal Foundational Kernel\nexport function createKernel(options = {}) {\n  const state = { initialized: true, tick: 0 };\n  return {\n    dispatch(action) {\n      state.tick++;\n      return { status: 'success', state };\n    },\n    getState: () => ({ ...state })\n  };\n}`
    },
    {
      stage: 1,
      name: 'State & Input Validation Pipeline',
      objective: 'Implement invariant assertions and input sanitization.',
      targetFile: 'src/state',
      code: `export function validateState(input) {\n  if (!input) throw new Error("Invalid payload");\n  return { valid: true, timestamp: Date.now() };\n}`
    }
  ];
}
