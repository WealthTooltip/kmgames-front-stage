/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/constants/enum/common.ts
 * @Description: 公共的枚举
 */

// 国际电话号码编号
export enum ECountryCodeEnum {
  CHINA = '86',
  HONGKONG = '852',
  MACAO = '853',
  KOREA = '82',
  JAPAN = '81',
  MALAYSIA = '60',
  THAILAND = '66',
  SINGAPORE = '65',
}

// 国家编号
export enum ECountryEnum {
  CHINA = 'CN',
  HONGKONG = 'HK',
  MACAO = 'MO',
  KOREA = 'KR',
  JAPAN = 'JP',
  MALAYSIA = 'MY',
  THAILAND = 'TH',
  SINGAPORE = 'SG',
}

// 国家语言编号
export enum ELanguageCodeEnum {
  CHINA = 'zh-CN',
  HONGKONG = 'zh-HK',
  MACAO = 'zh-MO',
  KOREA = 'ko-KR',
  JAPAN = 'ja-JP',
  MALAYSIA = 'ms-MY',
  THAILAND = 'th-TH',
  SINGAPORE = 'zh-SG',
}

// 语言名称
export enum ELanguageNameEnum {
  CHINA = '简体中文',
  HONGKONG = '繁體中文',
  MACAO = '繁體中文',
  KOREA = '한국어',
  JAPAN = '日本語',
  MALAYSIA = 'Bahasa Melayu',
  THAILAND = 'ภาษาไทย',
  SINGAPORE = '简体中文',
}

// ELanguageCodeEnum 和 ELanguageNameEnum 的映射
export const LanguageMap = [
  {text: ELanguageNameEnum.CHINA, value: ELanguageCodeEnum.CHINA},
  {text: ELanguageNameEnum.HONGKONG, value: ELanguageCodeEnum.HONGKONG},
  {text: ELanguageNameEnum.MACAO, value: ELanguageCodeEnum.MACAO},
  {text: ELanguageNameEnum.KOREA, value: ELanguageCodeEnum.KOREA},
  {text: ELanguageNameEnum.JAPAN, value: ELanguageCodeEnum.JAPAN},
  {text: ELanguageNameEnum.MALAYSIA, value: ELanguageCodeEnum.MALAYSIA},
  {text: ELanguageNameEnum.THAILAND, value: ELanguageCodeEnum.THAILAND},
  {text: ELanguageNameEnum.SINGAPORE, value: ELanguageCodeEnum.SINGAPORE},
];

// Popup Type
export enum PopupTypeEnum {
  CONFIRM = 0,
  ALERT1 = 1,
  ALERT2 = 2,
  ALERT3 = 3,
  ALERT4 = 4,
  ALERT5 = 5,
}
