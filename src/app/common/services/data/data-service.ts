import { IDataService } from './i-data-service';
import { ConfigurationService } from '../configuration.service';
import { DataSessionModel } from '../../models/data/dataSessionModel';
import { DataStorage } from '../../models/configuration/dataStorage.enum';
import { JsonStorageDataService } from './json-storage-data.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService implements IDataService {

    constructor(
        private configurationService: ConfigurationService,
        private jsonStorageDataService: JsonStorageDataService
    ) {}

    private getService(): Promise<IDataService> {
        return this.configurationService.getConfiguration().then(configuration => {
            switch(configuration.securitySettings.dataStorage) {
                case DataStorage.JsonStorage:
                default:
                return this.jsonStorageDataService;
            }
        });
    }


    getAll(): Promise<DataSessionModel[]> {
        return this.getService().then(service => service.getAll());
    }
    updateLastOpen(id: string): Promise<void> {
        return this.getService().then(service => service.updateLastOpen(id));
    }
    addNew(session: DataSessionModel): Promise<void> {
        return this.getService().then(service => service.addNew(session));
    }
    update(session: DataSessionModel): Promise<void> {
        return this.getService().then(service => service.update(session));
    }
    delete(id: string): Promise<void> {
        return this.getService().then(service => service.delete(id));
    }

    

}