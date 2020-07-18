import { DataStorage } from './dataStorage.enum';

export class SecuritySettingsModel {

    public dataStorage: DataStorage;
    public secret: string;

    constructor(
        dataStorage: DataStorage,
        secret: string
    ) {
        this.dataStorage = dataStorage;
        this.secret = secret;
    }
}
