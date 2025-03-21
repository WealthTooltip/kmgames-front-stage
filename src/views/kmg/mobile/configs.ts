/*
 * @Author = 'Passion.KMG
 * @Date = '2023-12-13
 * @LastEditors = 'Galen.GE
 * @FilePath = '/KMG/src/views/kmg/mobile/configs.ts
 * @Description = '项目客户端配置
*/
import PUBLIC_CONFIG from '../public/configs';

// 主题
export enum ETHEME {
  LIGHT = 'light',
  DARK = 'dark'
}

// 白天主题色
export enum ELIGHT {
  tooltipBg = '#909399',
  dpTheme = '#3586FF',
  dpStrong = '#0B0B0C',
  dpNormal = '#787878',
  dpAncillary ='#BFBFC0',
  dpButton ='#F8F8F8',
  dpBasicWhite ='#fff',
  dpBackground ='#F4F6FA',
  dpDivide ='#F3F4F6',
  dpForm1 ='#FAFBFF',
  dpForm2 ='#F3F9FF',
  dpOutline ='#DBDBDB',
  dpBar ='#FCFCFC',
  dpCar ='#fff',
  dpUpBackground = '#DFFFE7',
  dpUp = '#1FCC0C',
  dpDownBackground = '#FFECF0',
  dpDown = '#ED3737',
  dpHover = '#F0F6FF',
  dpDotted = '#E8F4FF',
  dpOddActive = 'linear-gradient(282deg,#519fff 15.69%,#a25fff)!important'
}

// 黑夜主题色
export enum EDARK {
  tooltipBg = '#909399',
  dpTheme = '#3586FF',
  dpStrong = '#F2F2F2',
  dpNormal = '#A6A6A6',
  dpAncillary = '#707173',
  dpButton = '#3B3C42',
  dpBasicWhite = '#fff',
  dpBackground = '#14171E',
  dpDivide = '#333539',
  dpForm1 = '#25262D',
  dpForm2 = '#303137',
  dpOutline = '#3D4152',
  dpBar = '#25262E',
  dpCar = '#1E1F26',
  dpUpBackground = '#1A3A2F',
  dpUp = '#1EF207',
  dpDownBackground = '#472126',
  dpDown = '#FF0802',
  dpDotted = '#3E4249',
  dpHover = '#223140',
  dpOddActive = 'linear-gradient(282deg,#519fff 15.69%,#a25fff)!important',
}

// 移动端白天主题色
export enum EMLIGHT {
  dpTheme = '#3586FF',
  dpStrong = '#19191A',
  dpNormal = '#A7AFBB',
  dpAncillary = '#B7BBC6',
  dpRed = '#ED4949',
  dpYellow = '#F6B73D',
  dpGreen = '#24C23D',
  dpBasicWhite = '#fff',
  dpBackground = '#EFF1F7',
  dpDivide = '#EAECF0',
  dpButton = '#fff',
  dpCard = '#F9FAFC',
  dpCardBorder = '#fff',
  dpTopBackground = '#fff',
  dpPromptBackground = '#F0F2F8',
  dpInputBackground = '#F5F7FF',
  dpCoinBg = '#F0F2F8'
}

// 移动端黑色主题色
export enum EMDARK {
  dpTheme = '#3586FF',
  dpStrong = '#fff',
  dpNormal = '#8E9298',
  dpAncillary = '#74767C',
  dpRed = '#ED4949',
  dpYellow = '#F6B73D',
  dpGreen = '#24C23D',
  dpBasicWhite = '#1A1A21',
  dpBackground = '#141415',
  dpDivide = '#3C3D45',
  dpButton = '#30313A',
  dpCard = '#24242B',
  dpCardBorder = '#292B2E',
  dpTopBackground = '#1D1F26',
  dpPromptBackground = '#3C3E4C',
  dpInputBackground = '#292C34',
  dpCoinBg = '#3C3E4C',
}

export default {
  ...PUBLIC_CONFIG,
};
