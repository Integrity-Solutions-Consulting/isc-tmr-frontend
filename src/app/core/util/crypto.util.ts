import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

const SECRET_KEY = environment.encryptionKey;

export function encryptPayload(data: any): { data: string; iv: string } {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, ' '));

  // Generar IV aleatorio de 16 bytes
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    data: encrypted.toString(), // ciphertext en Base64
    iv: iv.toString(CryptoJS.enc.Base64), // IV en Base64
  };
}
