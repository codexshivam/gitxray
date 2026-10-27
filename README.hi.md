<div align="center">

# ⚛ GitXray

### बिना किसी इंस्टॉलेशन के लाइव कोडबेस डिकम्पाइलर और एक्ज़ीक्यूशन ट्रेस इंजन

**किसी भी गिटहब यूआरएल (GitHub URL) में `github.com` को बदलकर `gitxray.dev` लिखें (या टर्मिनल में `npx gitxray` चलाएं) और किसी भी कोडबेस को तुरंत इंटरैक्टिव स्टेप-बाय-स्टेप विज़ुअलाइज़र, ब्लास्ट-रेडियस डिबगर, और "शुरुआत से बनाएं" ट्यूटोरियल में बदलें।**

[![CI](https://github.com/gitxray/gitxray/actions/workflows/ci.yml/badge.svg)](https://github.com/gitxray/gitxray/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Zero Config](https://img.shields.io/badge/Zero--Install-Browser--Native-8b5cf6.svg)](https://gitxray.dev)

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [हिन्दी](README.hi.md) • [Português](README.pt.md) • [日本語](README.ja.md)

</div>

---

```bash
# केवल एक शब्द का यूआरएल बदलाव:
https://github.com/facebook/react  ──►  https://gitxray.dev/facebook/react
```

ब्राउज़र में सीधे WebAssembly और WebGPU द्वारा संचालित, GitXray डेवलपर्स और छात्रों को वास्तविक समय में फ़ाइलों के बीच डेटा प्रवाह देखने और जटिल आर्किटेक्चर को समझने में सक्षम बनाता है—**शून्य इंस्टॉलेशन, शून्य एपीआई कीज़, और शून्य क्लाउड लागत**।

---

## ⚡ त्वरित शुरुआत

### 1. ब्राउज़र में शून्य इंस्टॉलेशन
अपने ब्राउज़र में किसी भी गिटहब यूआरएल में `github.com` को `gitxray.dev` में बदलें:
```text
https://github.com/Significant-Gravitas/AutoGPT ➔ https://gitxray.dev/Significant-Gravitas/AutoGPT
```
या सीधे वेब प्लेग्राउंड खोलें: **[https://gitxray.dev](https://gitxray.dev)**

### 2. लोकल टर्मिनल द्वारा
```bash
# तुरंत कोडबेस का निरीक्षण करें
npx gitxray

# लोकल सर्वर शुरू करें (localhost:3000)
npx gitxray serve

# 6 चरणों वाले "Build It Yourself" कोर्स को चलाएं
npx gitxray unbox

# Claude Code और Cursor के लिए CLAUDE.md एक्सपोर्ट करें
npx gitxray export-agents
```

---

## 📄 लाइसेंस

Apache License 2.0. पूरी तरह से ओपन-सोर्स।
