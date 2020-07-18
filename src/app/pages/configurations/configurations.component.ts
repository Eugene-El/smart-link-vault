import { Component, OnInit } from '@angular/core';
import { SelectModel } from 'src/app/common/models/selectModel';
import { DataStorage } from 'src/app/common/models/configuration/dataStorage.enum';
import { ConfigurationModel } from 'src/app/common/models/configuration/configurationModel';
import { ConfigurationService } from 'src/app/common/services/configuration.service';

@Component({
  selector: 'slv-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {

  constructor(
    private configurationService: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.methods.getDataStorages();
    this.methods.getConfiguration();
  }

  page = {
    hideSecret: true as boolean,
    storeOnYourDeviceId: DataStorage.OnDevice,
    configuration: null as ConfigurationModel
  }

  dataSources = {
    dataStorages: new Array<SelectModel>()
  }

  methods = {
    getDataStorages: () => {
      this.dataSources.dataStorages = [
        new SelectModel(DataStorage.ExtendsClass, "\"Extends Class\" storage"),
        new SelectModel(DataStorage.JsonStorage, "\"Json Storage\" storage"),
        new SelectModel(DataStorage.OnDevice, "Store on your device"),
      ];
    },
    getConfiguration: () => {
      this.configurationService.getConfiguration()
        .then(configuration => {
          this.page.configuration = configuration;
        });
    },
    saveConfiguration: () => {
      this.configurationService.saveConfiguration(this.page.configuration)
        .then(() => {
          this.methods.getConfiguration();
        });
    }
  }

}
