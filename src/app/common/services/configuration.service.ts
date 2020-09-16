import { Injectable, EventEmitter } from '@angular/core';
import { ConfigurationModel } from '../models/configuration/configurationModel';
import { ChromeService } from './chrome.service';
import { SecuritySettingsModel } from '../models/configuration/securitySettingsModel';
import { RandomValueService } from './random-value.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private chromeService: ChromeService,
    private randomValueService: RandomValueService
  ) { }

  private keys = {
    configuration: "configuration",
    localSecret: "SmartLinkVault"
  }

  public onConfigurationUpdated = new EventEmitter<void>();

  public getConfiguration() : Promise<ConfigurationModel> {

    return new Promise((resolve, reject) => {
      this.chromeService.getStorageItem(this.keys.configuration, this.keys.localSecret)
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
      this.chromeService.setStorageItem(this.keys.configuration, configuration, this.keys.localSecret)
        .then(() => {
          resolve();
          this.onConfigurationUpdated.emit();
        })
        .catch((error) => {
          reject(error);
        });
    });

  }

}
