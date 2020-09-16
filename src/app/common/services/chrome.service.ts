import { Injectable } from '@angular/core';
import { ChromeTabModel } from '../models/chrome/chromeTabModel';
import { EncryptingService } from './encrypting.service';

@Injectable({
  providedIn: 'root'
})
export class ChromeService {

  constructor(
    private encryptingService: EncryptingService
  ) { }

  getTabs() : Promise<Array<ChromeTabModel>> {

    return new Promise((resolve, reject) => {
      chrome.tabs.query({
        windowId: chrome.windows.WINDOW_ID_CURRENT
      }, (tabs: Array<any>) => {
        if (tabs == null || tabs.length == 0) {
          resolve(new Array<ChromeTabModel>());
        } else {
          resolve(tabs.map(t => new ChromeTabModel(t.id, t.title, t.url, t.favIconUrl, t.pinned)));
        }
      });
    });

  }

  getStorageItem(key: string, secret: string) : Promise<any> {

    return new Promise((resolve, reject) => {
      try
      {
        chrome.storage.sync.get(key, (result) => {
          if (result[key] == undefined)
            resolve(null);
          else 
          {
            var decrypted = this.encryptingService.decryptObjectByKey(result[key], secret)
            resolve(decrypted);
          }
        });
      } catch (error) {
        resolve(error);
      }
    });

  }
  setStorageItem(key: string, obj: any, secret: string) : Promise<void> {

    return new Promise((resolve, reject) => {
      try
      {
        var encrypted = this.encryptingService.encryptObjectByKey(obj, secret);
        chrome.storage.sync.set({ [key]: encrypted }, () => {
          resolve();
        });
      } catch (error) {
        resolve(error);
      }
    });

  }

}
