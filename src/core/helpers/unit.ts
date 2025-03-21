import CryptoJS from 'crypto-js';
import {TLeagueStatistic} from '@core/reducers/_reduxStore.d';
import {EMatchTypes} from '@constants/enum/sport';
/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/helpers/unit.ts
 * @Description: 通用的帮助方法
 */

// 随机UUID
export const getUUID = () => {
  const arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  const uuid = localStorage.getItem('uuid') ||
    `${_.sampleSize(arr, 4).join('')}-${_.sampleSize(arr, 8).join('')}-${_.sampleSize(arr, 4).join('')}-${_.sampleSize(
        arr,
        4,
    ).join('')}-${_.sampleSize(arr, 12).join('')}`;
  localStorage.setItem('uuid', uuid);
  return uuid;
};

// 休眠N秒
export const sleep = (time: number): any => new Promise((resolve) => setTimeout(resolve, time));

// 获取URL参数
export const getURLParams = (key: string): string | null => new URLSearchParams(window.location.search).get(key);

// 滚动到顶部
export const scrollToTop = (options: {} = {top: 0, behavior: 'smooth'}) => {
  document.getElementById('page-wrapper').scrollTo(options);
};

// 滚动到底部
export const scrollToBottom = () => {
  document.getElementById('page-wrapper').scrollTo({top: 999999, behavior: 'smooth'});
};

// 将字符串前4位和后4位显示，中间用*代替
export const zipString = (str: string): string => {
  if (str.length < 9) return str;
  return `${str.slice(0, 4)}****${str.slice(-4)}`;
};

export const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(value);

export const multiplyAndFix = (num1: number, num2: number) => {
  // 将数字转换为字符串
  const strNum1 = num1.toString();
  const strNum2 = num2.toString();

  // 计算小数位
  const decimalPlaces = (strNum1.split('.')[1] ? strNum1.split('.')[1].length : 0) +
                      (strNum2.split('.')[1] ? strNum2.split('.')[1].length : 0);

  // 转换为整数进行乘法
  const intNum1 = parseInt(strNum1.replace('.', ''), 10);
  const intNum2 = parseInt(strNum2.replace('.', ''), 10);
  const result = intNum1 * intNum2 / 10 ** decimalPlaces;

  // 返回保留两位小数的结果
  return Number(result.toFixed(2));
};

// 解密算法
export const undecodeData = (encodeData: string) => {
  // 解密
  const data = CryptoJS.enc.Base64.parse(encodeData);
  const chip = CryptoJS.lib.CipherParams.create({
    ciphertext: data,
  });
  const decData = CryptoJS.AES.decrypt(
      chip,
      CryptoJS.enc.Utf8.parse('0BLZcQo6PH&AFWit'),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      },
  ).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decData)?.data;
};

export const replaceMiddleWithDots = (str: string) => {
  if (str.length <= 6) {
    return str;
  }
  return `${str.substring(0, 2)}...${str.substring(str.length - 4)}`;
};


// ////// UNIT TOOLS ////////
export const findLeagueIdsWithCountGreaterThanN = (data: Array<TLeagueStatistic>, N: number, type?: EMatchTypes): Array<{id: number, state: EMatchTypes}> => {
  let total = 0;
  const result: Array<{id: number, state: EMatchTypes}> = [];
  _.each(_.groupBy(data, 'state'), (leaguesGroup: Array<TLeagueStatistic>, key: EMatchTypes): void | boolean => {
    if (_.includes(key, ',') || (type && type !== key)) {
      return true;
    }
    for (let i = 0; i < leaguesGroup.length; i++) {
      const item = leaguesGroup[i];
      total += item.countGroup[key];
      if (total >= N) {
        break;
      } else {
        result.push({id: item.leagueId, state: key});
      }
    }
  });
  return result;
};
