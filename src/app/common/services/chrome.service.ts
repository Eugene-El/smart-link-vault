import { Injectable } from '@angular/core';
import { ChromeTabModel } from '../models/chrome/chromeTabModel';

@Injectable({
  providedIn: 'root'
})
export class ChromeService {

  constructor() { }

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

}
