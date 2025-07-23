type SupportedLang = 'en' | 'th' | 'zh' | 'zh-TW' | 'ja' | 'ko';
declare function numberToWords(lang: SupportedLang, num: number): string;

export { type SupportedLang, numberToWords };
