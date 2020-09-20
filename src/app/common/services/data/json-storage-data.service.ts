import { Injectable } from '@angular/core';
import { IDataService } from './i-data-service';
import { DataSessionModel } from '../../models/data/dataSessionModel';
import { ConfigurationService } from '../configuration.service';
import { ChromeService } from '../chrome.service';
import { HttpClient } from '@angular/common/http';
import { PageModel } from '../../models/data/pageModel';
import { EncryptedDataModel } from '../../models/data/encryptedDataModel';
import { EncryptingService } from '../encrypting.service';
import { RandomValueService } from '../random-value.service';

@Injectable({
  providedIn: 'root'
})
export class JsonStorageDataService implements IDataService {

  constructor(
    private configurationService: ConfigurationService,
    private randomValueService: RandomValueService,
    private encryptingService: EncryptingService,
    private chromeService: ChromeService,
    private httpClient: HttpClient
  ) { }

  private keys = {
    externalId: "externalId",
    noSecret: "Secret is not configurated",
    apiBaseUrl: "https://jsonstorage.net/api/items/",
    maxPageSize: 2096795,
    exteranlIdLength: 36
  }

  private service = {
    get: (externalId: string): Promise<EncryptedDataModel> => {
      return this.httpClient.get<EncryptedDataModel>(this.keys.apiBaseUrl + externalId).toPromise()
    },
    getExternalId: (promise: Promise<any>): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        promise.then((obj: any) => {
          let path = (obj.uri as string).split('/');
          resolve(path[path.length - 1]);
        })
        .catch(error => reject(error));
      })
    },
    post: (data: EncryptedDataModel): Promise<string> => {
      return this.service.getExternalId(this.httpClient.post(this.keys.apiBaseUrl, data).toPromise());
    },
    put: (externalId: string, data: EncryptedDataModel): Promise<string> => {
      return this.service.getExternalId(this.httpClient.put(this.keys.apiBaseUrl + externalId, data).toPromise());
    }
  }

  private getSecretKey(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let noSecret = () => {
        reject(this.keys.noSecret);
      };
      this.configurationService.getConfiguration()
      .then(configuration => {
        if (configuration.securitySettings == null || configuration.securitySettings.secret == null)
          noSecret();
        else
          resolve(configuration.securitySettings.secret);
      })
      .catch(noSecret);
    });
  }
  private getRootExternalId(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let sendError = (error) => reject(error); 
      this.getSecretKey()
        .then((secret) => {
          this.chromeService.getStorageItem(this.keys.externalId, secret)
            .then((extrenalId) => {
              resolve(extrenalId as string);
            })
            .catch(sendError);
        })
        .catch(sendError);
    });
  }
  private setRootExternalId(extrenalId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let sendError = (error) => reject(error); 
      this.getSecretKey()
        .then((secret) => {
          this.chromeService.setStorageItem(this.keys.externalId, extrenalId, secret)
            .then(() => resolve(this.getRootExternalId()))
            .catch(sendError);
        })
        .catch(sendError);
    });
  }
  private getPages(externalId: string): Promise<Array<PageModel>> {
    return new Promise<Array<PageModel>>((resolve, reject) => {
      let pages = new Array<PageModel>();
      if (!externalId)
        resolve(pages);

      Promise.all([
        this.service.get(externalId),
        this.getSecretKey()
      ]).then(([encryptedPage, secret]: [EncryptedDataModel, string]) => {
          let page = this.encryptingService.decryptObjectByKey(encryptedPage.value, secret);
          let pageModel = PageModel.from(page);
          pages.push(pageModel);
          if (pageModel.haveNextPage()) {
            this.getPages(pageModel.nextPageExtenalId)
              .then((array: Array<PageModel>) => {
                pages.concat(array);
                resolve(pages);
              })
              .catch(error => reject(error));
          } else {
            resolve(pages);
          }
        })
        .catch(error => reject(error));
    });
  }
  private getExtrenalIds(): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      this.getRootExternalId()
        .then(externalId => {
          if (externalId == null || externalId == "")
            resolve([]);
          else
          {
            this.getPages(externalId)
              .then(pages => {
                let externalIds = pages.map(p => p.externalIds).reduce((a, b) => a.concat(b));
                resolve(externalIds);
              })
              .catch(error => reject(error));
          }
        })
        .catch(error => {
          if (error == this.keys.noSecret)
            reject(error);
          else
            resolve([]);
        });
    });
  }

  private splitAndEncryptDataSessions(dataSessions: Array<DataSessionModel>): Promise<Array<EncryptedDataModel>> {
    return new Promise<Array<EncryptedDataModel>>((resolve, reject) => {
      this.getSecretKey()
      .then(secret => {
        // Algorithm, that potentially can be improved
        let i = 0;
        let encryptedDataArray = new Array<EncryptedDataModel>();
        let arrayOfDataArrays = [dataSessions] as Array<Array<DataSessionModel>>;

        while(i < arrayOfDataArrays.length) {
          let data = new EncryptedDataModel(this.encryptingService.encryptObjectByKey(arrayOfDataArrays[i], secret));

          if (JSON.stringify(data).length < this.keys.maxPageSize) {
            encryptedDataArray.push(data);
            i++;
          } else {
            if (arrayOfDataArrays[i + 1] == null)
              arrayOfDataArrays.push(new Array<DataSessionModel>());
            arrayOfDataArrays[i + 1].push(arrayOfDataArrays[i].pop());
          }
        }
        resolve(encryptedDataArray);
      })
      .catch(error => reject(error));
    });
  }
  private splitEncryptAndWriteDataPages(rootExternalId: string, externalIds: Array<string>) : Promise<void> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getPages(rootExternalId),
        this.getSecretKey()
      ]).then(([pages, secret]: [Array<PageModel>, string]) => {


          if (pages == null)
            pages = new Array<PageModel>();
          if (pages.length == 0)
            pages.push(new PageModel([], ""));

          pages.forEach(page => page.externalIds = new Array<string>());
          pages[0].externalIds = externalIds;

          let i = 0;
          let encryptedDataArray = new Array<EncryptedDataModel>();

          while (i < pages.length) {
            let data = new EncryptedDataModel(this.encryptingService.encryptObjectByKey(pages[i], secret));
            let dataString = JSON.stringify(data);

            if (pages[i].haveNextPage() ? (dataString.length > this.keys.maxPageSize) : ((dataString.length + this.keys.exteranlIdLength) > this.keys.maxPageSize)) {
              if (pages[i + 1] == null)
                pages.push(new PageModel([], ""));

              pages[i + 1].externalIds.push(pages[i].externalIds.pop());
            } else {
              encryptedDataArray.push(data);
              i++;
            }
          }

          let nextPageUrl = "";
          let reversed = encryptedDataArray.reverse();
          let reversedPages = pages.reverse();
          i = 0;
          (async () => {
            while(i < reversedPages.length) {
              nextPageUrl = (i + 1) > reversedPages.length ? rootExternalId :
                ((reversedPages[i + 1] != null && reversedPages[i + 1].nextPageExtenalId != null) ? reversedPages[i + 1].nextPageExtenalId : "");
              if (nextPageUrl == "") {
                nextPageUrl = await this.service.post(reversed[i]);
              } else {
                nextPageUrl = await this.service.put(nextPageUrl, reversed[i]);
              }
              i++;
            }
          })().then(() => {
            if (rootExternalId != nextPageUrl) {
              this.setRootExternalId(nextPageUrl)
                .then(() => {
                  resolve();
                })
                .catch(error => reject(error));
            } else {
              resolve();
            }
          });
          

        })
        .catch(error => reject(error));
    })
  }
  private getEncryptedEmpty(): Promise<EncryptedDataModel> {
    return new Promise<EncryptedDataModel>((resolve, reject) => {
      this.getSecretKey()
        .then((secret) => {
          resolve(new EncryptedDataModel(this.encryptingService.encryptObjectByKey(new Array<DataSessionModel>(), secret)));
        })
        .catch(error => reject(error));
    });
  }
  private setDataSessions(dataSessions: Array<DataSessionModel>) : Promise<void> {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getRootExternalId(),
        this.splitAndEncryptDataSessions(dataSessions),
        this.getExtrenalIds(),
        this.getEncryptedEmpty()
      ]).then(([rootExternalId, encryptedDataArray, externalIds, empty]: [string, Array<EncryptedDataModel>, Array<string>, EncryptedDataModel]) => {
        

        if (externalIds == null)
          externalIds = [];

        let i = 0;
        let promises = new Array<Promise<string>>();
        while(i < encryptedDataArray.length || i < externalIds.length) {
          if (encryptedDataArray[i] != null) {
            if (externalIds[i] != null) {
              // Update
              promises.push(this.service.put(externalIds[i], encryptedDataArray[i]))
            } else {
              // Create
              promises.push(this.service.post(encryptedDataArray[i]));
            }
          } else if (externalIds[i] != null) {
            // Clear (delete)
            promises.push(this.service.put(externalIds[i], empty));
          }
          i++;
        }

        Promise.all(promises)
          .then((externalIds: Array<string>) => {

            resolve(this.splitEncryptAndWriteDataPages(rootExternalId, externalIds));

          })
          .catch(error => reject(error));

      })
      .catch(error => reject(error));
    });
  }



  public getAll(): Promise<Array<DataSessionModel>> {
    return new Promise<Array<DataSessionModel>>((resolve, reject) => {
      this.getExtrenalIds()
        .then(externalIds => {
          if (externalIds.length == 0)
            resolve([]);
          let promises = externalIds.map(id => this.httpClient.get(this.keys.apiBaseUrl + id).toPromise());
          Promise.all(promises)
            .then((encryptedData: Array<EncryptedDataModel>) => {
              
              this.getSecretKey()
                .then(secret => {

                  let sessions = encryptedData.map(d => this.encryptingService.decryptObjectByKey(d.value, secret))
                    .reduce((a, b) => a.concat(b), []) as Array<DataSessionModel>;

                  sessions = sessions.sort((s1, s2) => {
                    if (!s1.isFavorite && s2.isFavorite)
                      return 1;
                    else if (s1.isFavorite && !s2.isFavorite)
                      return -1;
                    
                    if (s1.lastOpen > s2.lastOpen)
                      return -1;
                    else if (s1.lastOpen < s2.lastOpen)
                      return 1;
                    
                    return 0;
                  });
                
                  resolve(sessions);
              })
              .catch(error => reject(error));

            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
  }
  public updateLastOpen(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getAll().then(dataSessions => {
        let session = dataSessions.find(s => s.id == id);
        if (session != null) {
          session.lastOpen = new Date();
          resolve(this.setDataSessions(dataSessions));
        } else {
          resolve();
        }
      })
      .catch(error => reject(error));
    });
  }
  public updateIsFavorite(id: string, isFavorite: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getAll().then(dataSessions => {
        let session = dataSessions.find(s => s.id == id);
        if (session != null) {
          session.isFavorite = isFavorite;
          resolve(this.setDataSessions(dataSessions));
        } else {
          resolve();
        }
      })
      .catch(error => reject(error));
    });
  }
  public addNew(session: DataSessionModel): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getAll().then(dataSessions => {
        let newSessionId = "";
        do
        {
          newSessionId = this.randomValueService.generateUuid();
        } while (dataSessions.some(s => s.id == newSessionId));
        session.id = newSessionId;

        dataSessions.push(session);
        resolve(this.setDataSessions(dataSessions));
      })
      .catch(error => reject(error));
    });
  }
  public update(session: DataSessionModel): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getAll().then(dataSessions => {
        let dbSession = dataSessions.find(s => s.id == session.id);
        if (dbSession != null) {
          dbSession.lastOpen = new Date();
          dbSession.isFavorite = session.isFavorite;
          dbSession.name = session.name;
          dbSession.tabs = session.tabs;
          dbSession.uniqIconUrls = session.uniqIconUrls;
          resolve(this.setDataSessions(dataSessions));
        } else {
          resolve();
        }
      })
      .catch(error => reject(error));
    });
  }
  public delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getAll().then(dataSessions => {
          dataSessions = dataSessions.filter(s => s.id != id);
          resolve(this.setDataSessions(dataSessions));
      })
      .catch(error => reject(error));
    });
  }

}
