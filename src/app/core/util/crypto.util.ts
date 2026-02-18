import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

const SECRET_KEY = environment.encryptionKey;

export function encryptPayload(data: any): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, ' '));

  const iv = CryptoJS.enc.Utf8.parse('\0'.repeat(16));

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}
