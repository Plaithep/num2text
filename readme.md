# num2text

Convert numbers into words across multiple languages:

- 🇬🇧 English (`en`)
- 🇹🇭 Thai (`th`)
- 🇨🇳 Simplified Chinese (`zh`)
- 🇹🇼 Traditional Chinese (`zh-TW`)
- 🇯🇵 Japanese (`ja`)
- 🇰🇷 Korean (`ko`)

Supports numbers up to the hundreds of millions.

---

## 🧪 Demo

Use the interactive demo here:
➡️ [https://plaithep.github.io/num2text/](https://plaithep.github.io/num2text/)

---

---

## 📦 Installation

```bash
npm install num2text
```

---

## 🚀 Usage

```ts
import { numberToWords } from 'num2text'

console.log(numberToWords('en', 1234567)) // one million two hundred thirty-four thousand five hundred sixty-seven
console.log(numberToWords('th', 101))      // หนึ่งร้อยเอ็ด
console.log(numberToWords('zh', 12345))   // 一万二千三百四十五
console.log(numberToWords('zh-TW', 1001)) // 壹仟零壹
console.log(numberToWords('ja', 1000000)) // 百万円
console.log(numberToWords('ko', 1234567)) // 백이십삼만사천오백육십칠


// with wordType option (only en, th supported)
console.log(numberToWords('en', 125, { wordType: 'currency' })) // one hundred twenty-five dollars
console.log(numberToWords('th', 2500, { wordType: 'currency' })) // สองพันห้าร้อยบาทถ้วน

```

---

## 🧠 API

```ts
function numberToWords(
  lang: SupportedLang,
  num: number,
  options?: { wordType: 'words' | 'currency' }
): string
```

### Parameters:
- `lang`: `'en' | 'th' | 'zh' | 'zh-TW' | 'ja' | 'ko'`
- `num`: Any non-negative integer ≤ 999,999,999
- `options.wordType`: (optional)
  - `words`: Default, converts to normal words 
  - `currency`: Currency style (only supported for en and th)
### Returns:
- Text representation of the number in the selected language


## 🧩 Development

```bash
npm install
npm run build
npm run test
```

---
