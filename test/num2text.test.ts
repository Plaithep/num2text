// test/num2text.test.ts
import { describe, expect, it } from '@jest/globals'
import { numberToWords } from '../src'

describe('numberToWords', () => {
  it('should convert numbers to English correctly', () => {
    {
      expect(numberToWords('en', 0)).toBe('zero')
      expect(numberToWords('en', 0.12)).toBe('zero point one two')
      expect(numberToWords('en', 0.345678)).toBe('zero point three four five six seven eight')

      expect(numberToWords('en', -0)).toBe('zero')
      expect(numberToWords('en', -0.12)).toBe('negative zero point one two')
      expect(numberToWords('en', -0.345678)).toBe('negative zero point three four five six seven eight')

      expect(numberToWords('en', 12)).toBe('twelve')
      expect(numberToWords('en', 123456)).toBe('one hundred twenty-three thousand four hundred fifty-six')
      expect(numberToWords('en', 123654.45)).toBe('one hundred twenty-three thousand six hundred fifty-four point four five')

      expect(numberToWords('en', -12)).toBe('negative twelve')
      expect(numberToWords('en', -123456)).toBe('negative one hundred twenty-three thousand four hundred fifty-six')
      expect(numberToWords('en', -123654.45)).toBe('negative one hundred twenty-three thousand six hundred fifty-four point four five')
    }

    {
      expect(numberToWords('en', 0, { wordType: 'currency' })).toBe('zero')
      expect(numberToWords('en', 0.12, { wordType: 'currency' })).toBe('twelve cents')
      expect(numberToWords('en', 0.345678, { wordType: 'currency' })).toBe('thirty-five cents')

      expect(numberToWords('en', -0, { wordType: 'currency' })).toBe('zero')
      expect(numberToWords('en', -0.12, { wordType: 'currency' })).toBe('negative twelve cents')
      expect(numberToWords('en', -0.345678, { wordType: 'currency' })).toBe('negative thirty-five cents')

      expect(numberToWords('en', 12, { wordType: 'currency' })).toBe('twelve dollars')
      expect(numberToWords('en', 123456, { wordType: 'currency' })).toBe('one hundred twenty-three thousand four hundred fifty-six dollars')
      expect(numberToWords('en', 123654.45, { wordType: 'currency' })).toBe('one hundred twenty-three thousand six hundred fifty-four dollars and forty-five cents')

      expect(numberToWords('en', -12, { wordType: 'currency' })).toBe('negative twelve dollars')
      expect(numberToWords('en', -123456, { wordType: 'currency' })).toBe('negative one hundred twenty-three thousand four hundred fifty-six dollars')
      expect(numberToWords('en', -123654.45, { wordType: 'currency' })).toBe('negative one hundred twenty-three thousand six hundred fifty-four dollars and forty-five cents')
    }
  })

  it('should convert numbers to Thai correctly', () => {
    {
      expect(numberToWords('th', 0)).toBe('ศูนย์')
      expect(numberToWords('th', 0.12)).toBe('ศูนย์จุดหนึ่งสอง')
      expect(numberToWords('th', 0.345678)).toBe('ศูนย์จุดสามสี่ห้าหกเจ็ดแปด')

      expect(numberToWords('th', -0)).toBe('ศูนย์')
      expect(numberToWords('th', -0.12)).toBe('ลบศูนย์จุดหนึ่งสอง')
      expect(numberToWords('th', -0.345678)).toBe('ลบศูนย์จุดสามสี่ห้าหกเจ็ดแปด')

      expect(numberToWords('th', 12)).toBe('สิบสอง')
      expect(numberToWords('th', 123456)).toBe('หนึ่งแสนสองหมื่นสามพันสี่ร้อยห้าสิบหก')
      expect(numberToWords('th', 123654.45)).toBe('หนึ่งแสนสองหมื่นสามพันหกร้อยห้าสิบสี่จุดสี่ห้า')

      expect(numberToWords('th', -12)).toBe('ลบสิบสอง')
      expect(numberToWords('th', -123456)).toBe('ลบหนึ่งแสนสองหมื่นสามพันสี่ร้อยห้าสิบหก')
      expect(numberToWords('th', -123654.45)).toBe('ลบหนึ่งแสนสองหมื่นสามพันหกร้อยห้าสิบสี่จุดสี่ห้า')
    }

    {
      expect(numberToWords('th', 0, { wordType: 'currency' })).toBe('ศูนย์บาทถ้วน')
      expect(numberToWords('th', 0.12, { wordType: 'currency' })).toBe('สิบสองสตางค์')
      expect(numberToWords('th', 0.345678, { wordType: 'currency' })).toBe('สามสิบห้าสตางค์')

      expect(numberToWords('th', -0, { wordType: 'currency' })).toBe('ศูนย์บาทถ้วน')
      expect(numberToWords('th', -0.12, { wordType: 'currency' })).toBe('ลบสิบสองสตางค์')
      expect(numberToWords('th', -0.345678, { wordType: 'currency' })).toBe('ลบสามสิบห้าสตางค์')

      expect(numberToWords('th', 12, { wordType: 'currency' })).toBe('สิบสองบาทถ้วน')
      expect(numberToWords('th', 123456, { wordType: 'currency' })).toBe('หนึ่งแสนสองหมื่นสามพันสี่ร้อยห้าสิบหกบาทถ้วน')
      expect(numberToWords('th', 123654.45, { wordType: 'currency' })).toBe('หนึ่งแสนสองหมื่นสามพันหกร้อยห้าสิบสี่บาทสี่สิบห้าสตางค์')

      expect(numberToWords('th', -12, { wordType: 'currency' })).toBe('ลบสิบสองบาทถ้วน')
      expect(numberToWords('th', -123456, { wordType: 'currency' })).toBe('ลบหนึ่งแสนสองหมื่นสามพันสี่ร้อยห้าสิบหกบาทถ้วน')
      expect(numberToWords('th', -123654.45, { wordType: 'currency' })).toBe('ลบหนึ่งแสนสองหมื่นสามพันหกร้อยห้าสิบสี่บาทสี่สิบห้าสตางค์')
    }
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
