<div align="center">

# ⚛ GitXray

### Descompilador e Rastreador de Código em Tempo Real Sem Instalação

**Substitua `github.com` por `gitxray.dev` em qualquer URL de repositório (ou execute `npx gitxray`) para descompilar instantaneamente o código-fonte em um visualizador passo a passo, depurador de raio de impacto e curso interativo "construa do zero".**

[![CI](https://github.com/gitxray/gitxray/actions/workflows/ci.yml/badge.svg)](https://github.com/gitxray/gitxray/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Zero Config](https://img.shields.io/badge/Zero--Install-Browser--Native-8b5cf6.svg)](https://gitxray.dev)

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [हिन्दी](README.hi.md) • [Português](README.pt.md) • [日本語](README.ja.md)

</div>

---

```bash
# Truque de 1 palavra no navegador:
https://github.com/facebook/react  ──►  https://gitxray.dev/facebook/react
```

Totalmente executado via WebAssembly e WebGPU no navegador, o GitXray permite que estudantes e desenvolvedores observem o fluxo de dados entre módulos em tempo real com **zero instalação, zero chaves de API e zero custo de nuvem**.

---

## ⚡ Início Rápido

### 1. Uso no Navegador sem Instalação
Altere qualquer URL do GitHub no navegador:
```text
https://github.com/Significant-Gravitas/AutoGPT ➔ https://gitxray.dev/Significant-Gravitas/AutoGPT
```
Ou acesse o ambiente: **[https://gitxray.dev](https://gitxray.dev)**

### 2. Linha de Comando Local
```bash
# Inspeção instantânea
npx gitxray

# Iniciar servidor local em localhost:3000
npx gitxray serve

# Descompilar em 6 marcos de reconstrução
npx gitxray unbox

# Exportar contexto para Claude Code, Cursor e Codex
npx gitxray export-agents
```

---

## 📄 Licença

Apache License 2.0. Código aberto para a comunidade global.
