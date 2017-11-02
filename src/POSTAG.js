// @flow

/**
 * 单词类型
 */

const POSTAG = {
  D_A: 0x40000000, // 形容词 形语素
  D_B: 0x20000000, // 区别词 区别语素
  D_C: 0x10000000, // 连词 连语素
  D_D: 0x08000000, // 副词 副语素
  D_E: 0x04000000, // 叹词 叹语素
  D_F: 0x02000000, // 方位词 方位语素
  D_I: 0x01000000, // 成语
  D_L: 0x00800000, // 习语
  A_M: 0x00400000, // 数词 数语素
  D_MQ: 0x00200000, // 数量词
  D_N: 0x00100000, // 名词 名语素
  D_O: 0x00080000, // 拟声词
  D_P: 0x00040000, // 介词
  A_Q: 0x00020000, // 量词 量语素
  D_R: 0x00010000, // 代词 代语素
  D_S: 0x00008000, // 处所词
  D_T: 0x00004000, // 时间词
  D_U: 0x00002000, // 助词 助语素
  D_V: 0x00001000, // 动词 动语素
  D_W: 0x00000800, // 标点符号
  D_X: 0x00000400, // 非语素字
  D_Y: 0x00000200, // 语气词 语气语素
  D_Z: 0x00000100, // 状态词
  A_NR: 0x00000080, // 人名
  A_NS: 0x00000040, // 地名
  A_NT: 0x00000020, // 机构团体
  A_NX: 0x00000010, // 外文字符
  A_NZ: 0x00000008, // 其他专名
  D_ZH: 0x00000004, // 前接成分
  D_K: 0x00000002, // 后接成分
  UNK: 0x00000000, // 未知词性
  URL: 0x00000001, // 网址、邮箱地址
};

const CN_POS_NAMES = {
  D_A: '形容词 形语素',
  D_B: '区别词 区别语素',
  D_C: '连词 连语素',
  D_D: '副词 副语素',
  D_E: '叹词 叹语素',
  D_F: '方位词 方位语素',
  D_I: '成语',
  D_L: '习语',
  A_M: '数词 数语素',
  D_MQ: '数量词',
  D_N: '名词 名语素',
  D_O: '拟声词',
  D_P: '介词',
  A_Q: '量词 量语素',
  D_R: '代词 代语素',
  D_S: '处所词',
  D_T: '时间词',
  D_U: '助词 助语素',
  D_V: '动词 动语素',
  D_W: '标点符号',
  D_X: '非语素字',
  D_Y: '语气词 语气语素',
  D_Z: '状态词',
  A_NR: '人名',
  A_NS: '地名',
  A_NT: '机构团体',
  A_NX: '外文字符',
  A_NZ: '其他专名',
  D_ZH: '前接成分',
  D_K: '后接成分',
  UNK: '未知',
  URL: '网址 邮箱地址',
};

const EN_POS_NAMES = {
  D_A: 'a',
  D_B: 'b',
  D_C: 'c',
  D_D: 'd',
  D_E: 'e',
  D_F: 'f',
  D_I: 'i',
  D_L: 'l',
  A_M: 'm',
  D_MQ: 'mq',
  D_N: 'n',
  D_O: 'o',
  D_P: 'p',
  A_Q: 'q',
  D_R: 'r',
  D_S: 's',
  D_T: 't',
  D_U: 'u',
  D_V: 'v',
  D_W: 'w',
  D_X: 'x',
  D_Y: 'y',
  D_Z: 'z',
  A_NR: 'nr',
  A_NS: 'ns',
  A_NT: 'nt',
  A_NX: 'nx',
  A_NZ: 'nz',
  D_ZH: 'h',
  D_K: 'k',
  UNK: 'un',
  URL: 'uri',
};

export function getPOSTagTranslator(POSTagDict: Object, I18NDict: Object): string {
  return (posTagNumber: number): string => {
    if (Number.isNaN(posTagNumber)) {
      return I18NDict[posTagNumber] || I18NDict.UNK;
    }
    const result = [];
    for (const key in POSTagDict) {
      if ((posTagNumber & POSTagDict[key]) > 0) {
        result.push(I18NDict[key]);
      }
    }
    if (result.length < 1) {
      return I18NDict.UNK;
    }
    return result.toString();
  };
}

export const cnPOSTag = getPOSTagTranslator(POSTAG, CN_POS_NAMES);
export const enPOSTag = getPOSTagTranslator(POSTAG, EN_POS_NAMES);

export default POSTAG;
