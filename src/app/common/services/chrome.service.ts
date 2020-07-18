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

  private localSecret = "SmartLinkVault";
  getStorageItem(key: string) : Promise<object> {

    return new Promise((resolve, reject) => {
      try
      {
        chrome.storage.sync.get(key, (result) => {
          var decrypted = this.encryptingService.decryptObjectByKey(result[key], this.localSecret)
          resolve(decrypted);
        });
      } catch (error) {
        resolve(error);
      }
    });

  }
  setStorageItem(key: string, obj: object) : Promise<void> {

    return new Promise((resolve, reject) => {
      try
      {
        var encrypted = this.encryptingService.encryptObjectByKey(obj, this.localSecret);
        chrome.storage.sync.set({ [key]: encrypted }, () => {
          resolve();
        });
      } catch (error) {
        resolve(error);
      }
    });

  }

}
