import { SecuritySettingsModel } from './securitySettingsModel';

export class ConfigurationModel {

    public securitySettings: SecuritySettingsModel;

    constructor(
        securitySettings: SecuritySettingsModel
    ) {
        this.securitySettings = securitySettings;
    }
}
