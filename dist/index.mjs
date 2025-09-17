// src/index.ts
function numberToWords(lang, num, options = { wordType: "words" }) {
  switch (lang) {
    case "en":
      return numberToEnglish(num, options.wordType);
    case "th":
      return numberToThai(num, options.wordType);
    case "zh":
      return numberToChinese(num);
    case "zh-TW":
      return numberToTraditionalChinese(num);
    case "ja":
      return numberToJapanese(num);
    case "ko":
      return numberToKorean(num);
    default:
      return num.toString();
  }
}
function numberToEnglish(num, wordType) {
  const units = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen"
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety"
  ];
  const scales = ["", "thousand", "million", "billion"];
  if (num === 0) return units[0];
  if (num < 0) return "negative " + numberToEnglish(-num, wordType);
  function underThousand(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let words = "";
    if (hundred > 0) {
      words += units[hundred] + " hundred";
      if (rest > 0) words += " ";
    }
    if (rest > 0) {
      if (rest < 20) {
        words += units[rest];
      } else {
        const ten = Math.floor(rest / 10);
        const unit = rest % 10;
        words += tens[ten];
        if (unit > 0) words += "-" + units[unit];
      }
    }
    return words;
  }
  const [integerPartStr, decimalPartStr] = num.toString().split(".");
  const integerPart = parseInt(integerPartStr, 10);
  const parts = [];
  const chunks = [];
  let tempNum = integerPart;
  while (tempNum > 0) {
    chunks.unshift(tempNum % 1e3);
    tempNum = Math.floor(tempNum / 1e3);
  }
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i] === 0) {
      continue;
    }
    const scaleIndex = chunks.length - i - 1;
    const chunkWords = underThousand(chunks[i]);
    const scale = scaleIndex < scales.length ? scales[scaleIndex] : "";
    parts.push(chunkWords + (scale ? " " + scale : ""));
  }
  let result = parts.join(" ").trim();
  if (decimalPartStr) {
    let decimalWords = "";
    switch (wordType) {
      case "currency":
        const firstTwoNumbers = parseInt(decimalPartStr.toString().slice(0, 2));
        decimalWords = underThousand(firstTwoNumbers);
        result += ` dollars and ${decimalWords} cents`;
        break;
      case "words":
        decimalWords = decimalPartStr.split("").map((digit) => units[Number(digit)]).join(" ");
        result += ` point ${decimalWords}`;
        break;
    }
  } else if (wordType === "currency") {
    result += " dollars";
  }
  return result;
}
function numberToThai(num, wordType) {
  if (num === 0) return "\u0E28\u0E39\u0E19\u0E22\u0E4C";
  if (num < 0) return "\u0E25\u0E1A" + numberToThai(-num, wordType);
  const thDigits = ["\u0E28\u0E39\u0E19\u0E22\u0E4C", "\u0E2B\u0E19\u0E36\u0E48\u0E07", "\u0E2A\u0E2D\u0E07", "\u0E2A\u0E32\u0E21", "\u0E2A\u0E35\u0E48", "\u0E2B\u0E49\u0E32", "\u0E2B\u0E01", "\u0E40\u0E08\u0E47\u0E14", "\u0E41\u0E1B\u0E14", "\u0E40\u0E01\u0E49\u0E32"];
  const thPositions = ["", "\u0E2A\u0E34\u0E1A", "\u0E23\u0E49\u0E2D\u0E22", "\u0E1E\u0E31\u0E19", "\u0E2B\u0E21\u0E37\u0E48\u0E19", "\u0E41\u0E2A\u0E19"];
  const MILLION = 1e6;
  function readNumber(n) {
    if (n === 0) return "";
    let result2 = "";
    const sNum = n.toString();
    const len = sNum.length;
    let needZero = false;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(sNum[i]);
      const pos = len - i - 1;
      if (digit === 0) {
        if (pos > 1 && result2 !== "") {
          let hasNonZeroAfter = false;
          for (let j = i + 1; j < len; j++) {
            if (parseInt(sNum[j]) !== 0) {
              hasNonZeroAfter = true;
              break;
            }
          }
          if (hasNonZeroAfter) {
            needZero = true;
          }
        }
        continue;
      }
      if (needZero) {
        needZero = false;
      }
      if (pos === 0 && digit === 1 && len > 1) {
        result2 += "\u0E40\u0E2D\u0E47\u0E14";
      } else if (pos === 1 && digit === 2) {
        result2 += "\u0E22\u0E35\u0E48" + thPositions[pos];
      } else if (pos === 1 && digit === 1) {
        result2 += thPositions[pos];
      } else {
        result2 += thDigits[digit] + (pos < thPositions.length ? thPositions[pos] : "");
      }
    }
    return result2;
  }
  const [integerPartStr, decimalPartStr] = num.toString().split(".");
  const integerPart = parseInt(integerPartStr, 10);
  const parts = [];
  let tempNum = integerPart;
  while (tempNum >= MILLION) {
    const millionPart = Math.floor(tempNum / MILLION);
    parts.push(readNumber(millionPart) + "\u0E25\u0E49\u0E32\u0E19");
    tempNum = tempNum % MILLION;
  }
  if (tempNum > 0) {
    parts.push(readNumber(tempNum));
  }
  let result = parts.join("").trim();
  if (decimalPartStr) {
    let decimalWords = "";
    switch (wordType) {
      case "currency":
        const firstTwoNumbers = parseInt(decimalPartStr.toString().substring(0, 2));
        decimalWords = readNumber(firstTwoNumbers);
        result += "\u0E1A\u0E32\u0E17" + decimalWords + "\u0E2A\u0E15\u0E32\u0E07\u0E04\u0E4C";
        break;
      case "words":
        decimalWords = decimalPartStr.split("").map((digit) => thDigits[parseInt(digit)]).join("");
        result += "\u0E08\u0E38\u0E14" + decimalWords;
        break;
    }
  } else if (wordType === "currency") {
    result += "\u0E1A\u0E32\u0E17\u0E16\u0E49\u0E27\u0E19";
  }
  return result;
}
function cjkConvert(num, digits, units, bigUnits, suppressOne) {
  if (num === 0) return digits[0];
  if (num < 0) return digits[0] + cjkConvert(-num, digits, units, bigUnits, suppressOne);
  let result = "";
  let unitIndex = 0;
  let needZero = false;
  while (num > 0) {
    const fourDigitChunk = num % 1e4;
    let chunkString = "";
    let hasNonZeroInCurrentChunk = false;
    let innerNeedZero = false;
    for (let i = 3; i >= 0; i--) {
      const digit = Math.floor(fourDigitChunk / 10 ** i) % 10;
      if (digit === 0) {
        if (i > 0 && hasNonZeroInCurrentChunk) {
          innerNeedZero = true;
        }
        continue;
      }
      hasNonZeroInCurrentChunk = true;
      if (innerNeedZero) {
        chunkString += digits[0];
        innerNeedZero = false;
      }
      const shouldSuppressOne = suppressOne && digit === 1 && i > 0;
      if (!shouldSuppressOne) {
        chunkString += digits[digit];
      }
      if (i > 0) {
        chunkString += units[i];
      }
    }
    if (hasNonZeroInCurrentChunk) {
      if (needZero && unitIndex > 0) {
        result = digits[0] + result;
      }
      const scaleUnit = unitIndex < bigUnits.length ? bigUnits[unitIndex] : "";
      result = chunkString + scaleUnit + result;
      needZero = false;
    } else if (unitIndex > 0 && result !== "") {
      needZero = true;
    }
    unitIndex++;
    num = Math.floor(num / 1e4);
  }
  result = result.replace(new RegExp(digits[0] + "{2,}", "g"), digits[0]);
  if (result.startsWith(digits[0])) {
    result = result.substring(1);
  }
  if (result.endsWith(digits[0])) {
    result = result.substring(0, result.length - 1);
  }
  if (result === "" && suppressOne) {
    return digits[1];
  }
  return result || digits[0];
}
function numberToChinese(num) {
  return cjkConvert(num, ["\u96F6", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D"], ["", "\u5341", "\u767E", "\u5343"], ["", "\u4E07", "\u4EBF"], false);
}
function numberToTraditionalChinese(num) {
  return cjkConvert(num, ["\u96F6", "\u58F9", "\u8CB3", "\u53C3", "\u8086", "\u4F0D", "\u9678", "\u67D2", "\u634C", "\u7396"], ["", "\u62FE", "\u4F70", "\u4EDF"], ["", "\u842C", "\u5104"], false);
}
function numberToJapanese(num) {
  return cjkConvert(num, ["\u96F6", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D"], ["", "\u5341", "\u767E", "\u5343"], ["", "\u4E07", "\u5104"], true);
}
function numberToKorean(num) {
  return cjkConvert(num, ["\uC601", "\uC77C", "\uC774", "\uC0BC", "\uC0AC", "\uC624", "\uC721", "\uCE60", "\uD314", "\uAD6C"], ["", "\uC2ED", "\uBC31", "\uCC9C"], ["", "\uB9CC", "\uC5B5"], true);
}
export {
  numberToWords
};
