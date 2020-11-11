import _ from 'lodash';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import cryptoPolyfill from './crypto-polyfill';

export const encrypt = (plainText: string, publicKey: string) => {
  // jsencrypt 库在加密后使用了base64编码,所以这里要先将base64编码后的密文转成buffer
  // 浏览器环境
  if (typeof window === 'object') {
    const encrypt = new cryptoPolyfill(); // 实例化加密对象
    encrypt.setPublicKey(publicKey); // 设置公钥
    const encryptoPasswd = encrypt.encrypt(plainText); // 加密明文
    return encryptoPasswd;
  } else {
    const pawBuffer = Buffer.from(plainText);
    const encryptText = cryptoPolyfill
      .publicEncrypt(
        {
          key: Buffer.from(publicKey), // 如果通过文件方式读入就不必转成Buffer
          padding: 1
          // padding: crypto.constants.RSA_PKCS1_PADDING
        },
        pawBuffer
      )
      .toString('base64');
    return encryptText;
  }
};

export default function buildTree(nodes: any[]) {
  /* nodes structure
  [
    {"id": "1", "children": ["2"], "root": true},
    {"id": "2", "children": ["3", "4"], "root": false},
    {"id": "3", "children": [], "root": false},
    {"id": "4", "children": [], "root": false},
  ]

  转换成 ->
  {
    id: 1,
    children: [
      {
        id: 2,
        children: [
          {
            id: 3,
            children: []
          },
          {
            id: 4,
            children: []
          }
        ]
      }
    ]
  }
  */
  const rootNodes = [_.find(nodes, { root: true })];
  const mapChildren = (childId: any) => {
    const node = _.find(nodes, x => x.id === childId) || null;
    if (_.isArray(node.children) && node.children.length > 0) {
      node.children = node.children
        .map(mapChildren)
        .filter((node: any) => node !== null);
    }
    return node;
  };
  const tree = rootNodes.map(node => {
    node.children = node.children
      .map(mapChildren)
      .filter((node: any) => node !== null);
    return node;
  });
  return tree[0];
}

/**
 * @description 验证 jwt token
 *
 */
export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as any;
  return decoded;
};

export const deepEqual = function(x: any, y: any) {
  if (x === y) {
    return true;
  } else if (
    typeof x == 'object' &&
    x != null &&
    typeof y == 'object' &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
};
