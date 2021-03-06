import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptingService {

  constructor() { }

  public encryptObjectByKey(obj: any, key: string) : string {
    let str = JSON.stringify(obj);
    let encryptedStr = CryptoJS.AES.encrypt(str, key);
    return new String(encryptedStr).toString();
  }

  public decryptObjectByKey(str: string, key: string) : any {
    try
    {
      let decryptedBytes = CryptoJS.AES.decrypt(str, key);
      let decryptedStr = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedStr);
    } catch {
      return null;
    }
  }
}
