<div align="center">

# ⚛ GitXray

### Descompilador y Trazador de Código en Vivo Sin Instalación

**Reemplace `github.com` con `gitxray.dev` en la URL de cualquier repositorio (o ejecute `npx gitxray`) para descompilar instantáneamente código estático en un visualizador de ejecución paso a paso, un depurador de radio de impacto y un curso interactivo "constrúyalo desde cero".**

[![CI](https://github.com/gitxray/gitxray/actions/workflows/ci.yml/badge.svg)](https://github.com/gitxray/gitxray/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Zero Config](https://img.shields.io/badge/Zero--Install-Browser--Native-8b5cf6.svg)](https://gitxray.dev)

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [हिन्दी](README.hi.md) • [Português](README.pt.md) • [日本語](README.ja.md)

</div>

---

```bash
# El truco de navegador en 1 palabra:
https://github.com/facebook/react  ──►  https://gitxray.dev/facebook/react
```

Totalmente impulsado por WebAssembly y WebGPU en el navegador, GitXray permite a desarrolladores y estudiantes observar el flujo de datos entre archivos en tiempo real y reconstruir arquitecturas capa por capa con **cero instalación, cero claves API y cero costos en la nube**.

---

## ⚡ Inicio Rápido

### 1. Uso en Navegador sin Instalación
Cambie cualquier URL de GitHub en la barra de direcciones de `github.com` a `gitxray.dev`:
```text
https://github.com/Significant-Gravitas/AutoGPT ➔ https://gitxray.dev/Significant-Gravitas/AutoGPT
```
O abra el entorno interactivo: **[https://gitxray.dev](https://gitxray.dev)**

### 2. Uso en Terminal Local
```bash
# Inspección instantánea
npx gitxray

# Iniciar el visualizador web en localhost:3000
npx gitxray serve

# Descompilar el proyecto en 6 hitos de reconstrucción
npx gitxray unbox

# Exportar ontología para Claude Code, Cursor y Codex
npx gitxray export-agents
```

---

## 📄 Licencia

Licencia Apache 2.0. Código abierto para estudiantes e ingenieros de todo el mundo.
