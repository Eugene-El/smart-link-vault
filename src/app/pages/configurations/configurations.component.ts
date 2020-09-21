import { Component, OnInit } from '@angular/core';
import { SelectModel } from 'src/app/common/models/selectModel';
import { DataStorage } from 'src/app/common/models/configuration/dataStorage.enum';
import { ConfigurationModel } from 'src/app/common/models/configuration/configurationModel';
import { ConfigurationService } from 'src/app/common/services/configuration.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { DataService } from 'src/app/common/services/data/data-service';

@Component({
  selector: 'slv-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {

  constructor(
    private loadingService: LoadingService,
    private configurationService: ConfigurationService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.methods.getDataStorages();
    this.methods.getConfiguration();
  }

  page = {
    hideSecret: true as boolean,
    storeOnYourDeviceId: DataStorage.OnDevice,
    configuration: null as ConfigurationModel,
    oldSecret: null as string,
    showClearMessage: false as boolean
  }

  dataSources = {
    dataStorages: new Array<SelectModel>()
  }

  methods = {
    getDataStorages: () => {
      this.dataSources.dataStorages = [
        // Work in progress
        //new SelectModel(DataStorage.ExtendsClass, "\"Extends Class\" storage"),
        new SelectModel(DataStorage.JsonStorage, "\"Json Storage\" storage"),
        //new SelectModel(DataStorage.OnDevice, "Store on your device"),
      ];
    },
    getConfiguration: () => {
      this.loadingService.handlePromise(this.configurationService.getConfiguration())
        .then(configuration => {
          this.page.configuration = configuration;
          this.page.oldSecret = this.page.configuration.securitySettings.secret;
        });
    },
    saveConfiguration: () => {

      if (this.page.configuration.securitySettings.secret == this.page.oldSecret) {

        this.configurationService.saveConfiguration(this.page.configuration)
        .then(() => {
          this.methods.getConfiguration();
        });

      } else {

        this.loadingService.handlePromise(this.dataService.getAll().then(sessions => {
          return this.configurationService.saveConfiguration(this.page.configuration)
            .then(() => {
              return this.dataService.addMany(sessions);
            });
        })).then();


      }

    },
    clearStorage: () => {
      this.loadingService.handlePromise(this.dataService.clearStorage())
        .then(() => {
          this.page.showClearMessage = false;
          this.methods.getConfiguration();
        })
    }
  }

}
