// src/index.ts

export type SupportedLang = 'en' | 'th' | 'zh' | 'zh-TW' | 'ja' | 'ko';
export type SupportedWordType = 'words' | 'currency';
export type Option = {
  wordType: SupportedWordType;
};

export function numberToWords(lang: SupportedLang, num: number, options: Option = { wordType: 'words'}): string {
  switch (lang) {
    case 'en': return numberToEnglish(num, options.wordType);
    case 'th': return numberToThai(num, options.wordType);
    case 'zh': return numberToChinese(num);
    case 'zh-TW': return numberToTraditionalChinese(num);
    case 'ja': return numberToJapanese(num);
    case 'ko': return numberToKorean(num);
    default: return num.toString();
  }
}

// English (up to billion)
function numberToEnglish(num: number, wordType: SupportedWordType): string {
  const units = [
    'zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
    'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];
  const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty',
    'sixty', 'seventy', 'eighty', 'ninety'
  ];
  const scales = ['', 'thousand', 'million', 'billion'];

  if (num === 0) return units[0];
  if (num < 0) return 'negative ' + numberToEnglish(-num, wordType);

  function underThousand(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let words = '';
    
    if (hundred > 0) {
      words += units[hundred] + ' hundred';
      if (rest > 0) words += ' ';
    }
    
    if (rest > 0) {
      if (rest < 20) {
        words += units[rest];
      } else {
        const ten = Math.floor(rest / 10);
        const unit = rest % 10;
        words += tens[ten];
        if (unit > 0) words += '-' + units[unit];
      }
    }
    return words;
  }
  const [integerPartStr, decimalPartStr] = num.toString().split('.');
  const integerPart = parseInt(integerPartStr, 10);

  const parts: string[] = [];
  const chunks: number[] = [];
  let tempNum = integerPart;
  
  while (tempNum > 0) {
    chunks.unshift(tempNum % 1000);
    tempNum = Math.floor(tempNum / 1000);
  }

  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i] === 0) {
      continue;
    }
    const scaleIndex = chunks.length - i - 1;
    const chunkWords = underThousand(chunks[i]);
    const scale = scaleIndex < scales.length ? scales[scaleIndex] : '';
    parts.push(chunkWords + (scale ? ' ' + scale : ''));
  }

  
  let result = parts.join(' ').trim();

  // Convert decimal part if exists
  if (decimalPartStr) {
    let decimalWords = '';

    switch (wordType) {
      case 'currency':
        // Take first two digits, convert to words using underThousand
        const firstTwoNumbers = parseInt(decimalPartStr.toString().slice(0, 2))
        decimalWords = underThousand(firstTwoNumbers);

        result += ` dollars and ${decimalWords} cents`;
        break;

      case 'words':
        // Convert each decimal digit to word
        decimalWords = decimalPartStr
          .split('')
          .map(digit => units[Number(digit)])
          .join(' ');

        result += ` point ${decimalWords}`;
        break;
    }
  } else if (wordType === 'currency') {
    result += ' dollars';
  }

  return result;
}

// Thai (Fixed)
function numberToThai(num: number, wordType: SupportedWordType): string {
  if (num === 0) return 'ศูนย์';
  if (num < 0) return 'ลบ' + numberToThai(-num, wordType);
  
  const thDigits = ['ศูนย์','หนึ่ง','สอง','สาม','สี่','ห้า','หก','เจ็ด','แปด','เก้า'];
  const thPositions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];
  const MILLION = 1000000;

  function readNumber(n: number): string {
    if (n === 0) return '';
    
    let result = '';
    const sNum = n.toString();
    const len = sNum.length;
    let needZero = false;

    for (let i = 0; i < len; i++) {
      const digit = parseInt(sNum[i]);
      const pos = len - i - 1;

      if (digit === 0) {
        // Check if we need to add "ศูนย์" for zero in the middle
        // Only add zero if there's a gap between non-zero digits (not consecutive)
        if (pos > 1 && result !== '') { // pos > 1 to avoid adding zero before tens/units
          // Look ahead to see if there are non-zero digits
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

      // Add zero if needed before this digit
      if (needZero) {
        //result += 'ศูนย์';
        needZero = false;
      }

      if (pos === 0 && digit === 1 && len > 1) {
        // หลักหน่วยเป็น 1 และไม่ใช่เลขหลักเดียว
        result += 'เอ็ด';
      } else if (pos === 1 && digit === 2) {
        // หลักสิบเป็น 2
        result += 'ยี่' + thPositions[pos];
      } else if (pos === 1 && digit === 1) {
        // หลักสิบเป็น 1
        result += thPositions[pos];
      } else {
        result += thDigits[digit] + (pos < thPositions.length ? thPositions[pos] : '');
      }
    }
    return result;
  }

  const [integerPartStr, decimalPartStr] = num.toString().split('.');
  const integerPart = parseInt(integerPartStr, 10);

  const parts: string[] = [];
  let tempNum = integerPart;
  
  // จัดการหลักล้านขึ้นไป
  while (tempNum >= MILLION) {
    const millionPart = Math.floor(tempNum / MILLION);
    parts.push(readNumber(millionPart) + 'ล้าน');
    tempNum = tempNum % MILLION;
  }
  
  // จัดการหลักต่ำกว่าล้าน
  if (tempNum > 0) {
    parts.push(readNumber(tempNum));
  }

  let result = parts.join('').trim();

  // Convert decimal part if exists
  if (decimalPartStr) {
    let decimalWords = '';

    switch (wordType) {
      case 'currency':
        const firstTwoNumbers = parseInt(decimalPartStr.toString().substring(0, 2));
        decimalWords = readNumber(firstTwoNumbers);
        result += 'บาท' + decimalWords + 'สตางค์';
      break;

      case 'words':
        decimalWords = decimalPartStr
          .split('')
          .map(digit => thDigits[parseInt(digit)])
          .join('');

        result += 'จุด' + decimalWords;
      break;
    }
  } else if (wordType === 'currency') {
    result += 'บาทถ้วน';
  }

  return result;
}

// CJK Shared Base (Fixed)
function cjkConvert(num: number, digits: string[], units: string[], bigUnits: string[], suppressOne: boolean): string {
  if (num === 0) return digits[0];
  if (num < 0) return digits[0] + cjkConvert(-num, digits, units, bigUnits, suppressOne);

  let result = '';
  let unitIndex = 0;
  let needZero = false;

  while (num > 0) {
    const fourDigitChunk = num % 10000;
    let chunkString = '';
    let hasNonZeroInCurrentChunk = false;
    let innerNeedZero = false;

    // Process digits within the 4-digit chunk (千, 百, 十, 一)
    for (let i = 3; i >= 0; i--) {
      const digit = Math.floor(fourDigitChunk / (10 ** i)) % 10;
      
      if (digit === 0) {
        if (i > 0 && hasNonZeroInCurrentChunk) {
          innerNeedZero = true;
        }
        continue;
      }

      hasNonZeroInCurrentChunk = true;

      // Add zero if needed within chunk
      if (innerNeedZero) {
        chunkString += digits[0];
        innerNeedZero = false;
      }

      // Handle 'one' suppression for Japanese/Korean
      const shouldSuppressOne = suppressOne && digit === 1 && i > 0;
      if (!shouldSuppressOne) {
        chunkString += digits[digit];
      }
      
      if (i > 0) {
        chunkString += units[i];
      }
    }

    if (hasNonZeroInCurrentChunk) {
      // Add zero between chunks if needed
      if (needZero && unitIndex > 0) {
        result = digits[0] + result;
      }
      
      // Add big unit (万, 億) if not the first chunk
      const scaleUnit = unitIndex < bigUnits.length ? bigUnits[unitIndex] : '';
      result = chunkString + scaleUnit + result;
      needZero = false;
    } else if (unitIndex > 0 && result !== '') {
      // This chunk is zero but there are non-zero chunks after it
      needZero = true;
    }

    unitIndex++;
    num = Math.floor(num / 10000);
  }

  // Clean up multiple zeros
  result = result.replace(new RegExp(digits[0] + '{2,}', 'g'), digits[0]);
  // Remove leading zero
  if (result.startsWith(digits[0])) {
    result = result.substring(1);
  }
  // Remove trailing zero
  if (result.endsWith(digits[0])) {
    result = result.substring(0, result.length - 1);
  }

  // Special case: if result is empty and suppressOne is true, return '一' or '일'
  if (result === '' && suppressOne) {
    return digits[1];
  }

  return result || digits[0];
}

// Chinese (Simplified)
function numberToChinese(num: number): string {
  return cjkConvert(num, ['零','一','二','三','四','五','六','七','八','九'], ['', '十', '百', '千'], ['', '万', '亿'], false);
}

// Traditional Chinese (zh-TW)
function numberToTraditionalChinese(num: number): string {
  return cjkConvert(num, ['零','壹','貳','參','肆','伍','陸','柒','捌','玖'], ['', '拾', '佰', '仟'], ['', '萬', '億'], false);
}

// Japanese
function numberToJapanese(num: number): string {
  return cjkConvert(num, ['零','一','二','三','四','五','六','七','八','九'], ['', '十', '百', '千'], ['', '万', '億'], true);
}

// Korean
function numberToKorean(num: number): string {
  return cjkConvert(num, ['영','일','이','삼','사','오','육','칠','팔','구'], ['', '십', '백', '천'], ['', '만', '억'], true);
}