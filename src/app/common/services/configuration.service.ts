import { Injectable } from '@angular/core';
import { ConfigurationModel } from '../models/configuration/configurationModel';
import { ChromeService } from './chrome.service';
import { SecuritySettingsModel } from '../models/configuration/securitySettingsModel';
import { RandomValueService } from './random-value.service';
import { rejects } from 'assert';
import { DataStorage } from '../models/configuration/dataStorage.enum';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private chromeService: ChromeService,
    private randomValueService: RandomValueService
  ) { }

  private keys = {
    configuration: "configuration"
  }

  public getConfiguration() : Promise<ConfigurationModel> {

    return new Promise((resolve, reject) => {
      this.chromeService.getStorageItem(this.keys.configuration)
        .then((configuration: ConfigurationModel) => {
          if (configuration == null)
            resolve(new ConfigurationModel(
              new SecuritySettingsModel(null, this.randomValueService.generateSecret())
            ));

          resolve(configuration);
          
        })
        .catch(error => reject(error));
    });

  }

  public saveConfiguration(configuration: ConfigurationModel) : Promise<void> {

    return new Promise((resolve, reject) => {
      this.chromeService.setStorageItem(this.keys.configuration, configuration)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });

  }

}
