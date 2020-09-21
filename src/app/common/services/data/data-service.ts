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
    updateIsFavorite(id: string, isFavorite: boolean): Promise<void> {
        return this.getService().then(service => service.updateIsFavorite(id, isFavorite));
    }
    addNew(session: DataSessionModel): Promise<void> {
        return this.getService().then(service => service.addNew(session));
    }
    addMany(sessions: Array<DataSessionModel>): Promise<void> {
        return this.getService().then(service => service.addMany(sessions));
    }
    update(session: DataSessionModel): Promise<void> {
        return this.getService().then(service => service.update(session));
    }
    delete(id: string): Promise<void> {
        return this.getService().then(service => service.delete(id));
    }
    clearStorage(): Promise<void> {
        return this.getService().then(service => service.clearStorage());
    }

    

}