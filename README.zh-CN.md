<div align="center">

# ⚛ GitXray

### 零安装浏览器实时代码库反编译器与执行追踪引擎

**在任何 GitHub 仓库 URL 中将 `github.com` 替换为 `gitxray.dev`（或直接运行 `npx gitxray`），即可将静态源码瞬间反编译为可交互的逐行执行可视化器、爆炸半径调试器与“从零构建”实战教程。**

[![CI](https://github.com/gitxray/gitxray/actions/workflows/ci.yml/badge.svg)](https://github.com/gitxray/gitxray/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![WASM Engine](https://img.shields.io/badge/WASM-Tree--Sitter-06b6d4.svg)](#四层确定性架构)
[![Zero Config](https://img.shields.io/badge/Zero--Install-Browser--Native-8b5cf6.svg)](https://gitxray.dev)

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [हिन्दी](README.hi.md) • [Português](README.pt.md) • [日本語](README.ja.md)

</div>

---

```bash
# 浏览器一键秒变可视化：
https://github.com/facebook/react  ──►  https://gitxray.dev/facebook/react
```

GitXray 完全由浏览器端的 WebAssembly 与 WebGPU 驱动，让开发者与学生能够实时观察跨文件数据流动，并按层次重构复杂架构——**无需安装、无需 API 密钥、零云端成本**。

---

## ⚡ 极速上手

### 1. 浏览器免安装使用
在浏览器地址栏中将任何 GitHub 仓库的 `github.com` 修改为 `gitxray.dev`：
```text
https://github.com/Significant-Gravitas/AutoGPT ➔ https://gitxray.dev/Significant-Gravitas/AutoGPT
```
或访问交互式实验台：**[https://gitxray.dev](https://gitxray.dev)**

### 2. 终端本地快速检查
```bash
# 秒级检查当前目录或克隆仓库
npx gitxray

# 在本地启动浏览器可视化引擎 (localhost:3000)
npx gitxray serve

# 将项目反编译为 6 阶段从零实现闯关教程
npx gitxray unbox

# 为 Claude Code、Cursor、Codex 导出精准 AST 上下文
npx gitxray export-agents
```

---

## 🏛 开源架构宝库（精选 50 款顶级仓库）

包含 AI 智能体体系（openclaw、AutoGPT、llama.cpp、ollama）、前端界面架构（react、vue、svelte、shadcn-ui）、核心基础系统（linux、sqlite、redis、fastapi、node）与编译器体系（tree-sitter、esbuild、bun、ripgrep），均支持一键在线反编译。

详细表格请见英文主文档 [English README](README.md)。

---

## 🔬 四层确定性架构

1. **第一层：微秒级增量 AST 与图中心性计算**：利用 WebAssembly Tree-sitter 配合 PageRank、中介中心性与聚类算法，自动提炼出占系统 5% 的核心领域逻辑。
2. **第二层：多文件实时执行追踪（全仓库版 Python Tutor）**：时间轴自由拖动回溯，观察调用栈、变量变更与数据库状态差异。
3. **第三层：自动化拆解模式（Build-Your-Own-X 编译器）**：提取 40-80 行 Stage 0 核心微内核，由确定性测试套件硬性校验，拒绝 LLM 幻觉批改。
4. **第四层：爆炸半径防护盾与 .agents / CLAUDE.md 导出**：提交前量化变更影响面，一键缩减 98% AI 编码上下文 Token 消耗。

---

## 📄 开源许可证

Apache License 2.0.
