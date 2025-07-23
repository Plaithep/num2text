// test/num2text.test.ts
import { describe, expect, it } from '@jest/globals'
import { numberToWords } from '../src'

describe('numberToWords', () => {
  it('should convert numbers to English correctly', () => {
    expect(numberToWords('en', 0)).toBe('zero')
    expect(numberToWords('en', 15)).toBe('fifteen')
    expect(numberToWords('en', 1234567)).toBe(
      'one million two hundred thirty-four thousand five hundred sixty-seven'
    )
  })

  it('should convert numbers to Thai correctly', () => {
    expect(numberToWords('th', 101)).toBe('หนึ่งร้อยเอ็ด')
    expect(numberToWords('th', 1001)).toBe('หนึ่งพันเอ็ด')
    expect(numberToWords('th', 200000000)).toBe('สองร้อยล้าน')
  })

  it('should convert numbers to Simplified Chinese correctly', () => {
    expect(numberToWords('zh', 0)).toBe('零')
    expect(numberToWords('zh', 1234567)).toBe('一百二十三万四千五百六十七')
  })

  it('should convert numbers to Traditional Chinese correctly', () => {
    expect(numberToWords('zh-TW', 1001)).toBe('壹仟零壹')
    expect(numberToWords('zh-TW', 10000)).toBe('壹萬')
  })

  it('should convert numbers to Japanese correctly', () => {
    expect(numberToWords('ja', 1234567)).toBe('百二十三万四千五百六十七')
  })

  it('should convert numbers to Korean correctly', () => {
    expect(numberToWords('ko', 1234567)).toBe('백이십삼만사천오백육십칠')
  })
})
