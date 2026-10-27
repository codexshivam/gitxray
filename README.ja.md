<div align="center">

# ⚛ GitXray

### インストール不要・ブラウザネイティブのライブコードベース逆コンパイラ＆実行トレース

**任意の GitHub リポジトリ URL で `github.com` を `gitxray.dev` に書き換えるか、ターミナルで `npx gitxray` を実行するだけで、静的コードを瞬時にステップ実行ビジュアライザ、影響範囲デバッガ、「ゼロから作る」実践チュートリアルへと逆コンパイルします。**

[![CI](https://github.com/gitxray/gitxray/actions/workflows/ci.yml/badge.svg)](https://github.com/gitxray/gitxray/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Zero Config](https://img.shields.io/badge/Zero--Install-Browser--Native-8b5cf6.svg)](https://gitxray.dev)

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [हिन्दी](README.hi.md) • [Português](README.pt.md) • [日本語](README.ja.md)

</div>

---

```bash
# ブラウザのアドレスバーで1単語書き換えるだけ：
https://github.com/facebook/react  ──►  https://gitxray.dev/facebook/react
```

ブラウザ内の WebAssembly と WebGPU で 100% 動作するため、**インストール不要、API キー不要、クラウド費用ゼロ** で、複数ファイル間のデータフローをリアルタイムで追跡し、複雑なアーキテクチャを段階的に理解・再構築できます。

---

## ⚡ クイックスタート

### 1. ブラウザでの利用
アドレスバーの `github.com` を `gitxray.dev` に変更：
```text
https://github.com/Significant-Gravitas/AutoGPT ➔ https://gitxray.dev/Significant-Gravitas/AutoGPT
```
または Web プレイグラウンドを開く: **[https://gitxray.dev](https://gitxray.dev)**

### 2. ローカルターミナルでの利用
```bash
# カレントディレクトリをミリ秒で解析
npx gitxray

# ローカル可視化サーバー起動 (localhost:3000)
npx gitxray serve

# 6段階のビルドチュートリアルに展開
npx gitxray unbox

# Claude Code や Cursor 向けに CLAUDE.md を出力
npx gitxray export-agents
```

---

## 📄 ライセンス

Apache License 2.0. 全世界でオープンソースとして利用可能です。
