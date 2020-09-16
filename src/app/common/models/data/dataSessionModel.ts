import { DataTabModel } from './dataTabModel';

export class DataSessionModel {

    public id: string;
    public name: string;
    public tabs: Array<DataTabModel>;
    public uniqIconUrls: Array<string>;
    public isFavorite: boolean;
    public lastOpen: Date;

    constructor(
        id: string,
        name: string,
        tabs: Array<DataTabModel>,
        uniqIconUrls: Array<string>,
        isFavorite: boolean,
        lastOpen: Date
    ) {
        this.id = id;
        this.name = name;
        this.tabs = tabs;
        this.uniqIconUrls = uniqIconUrls;
        this.isFavorite = isFavorite;
        this.lastOpen = lastOpen;
    }
}
