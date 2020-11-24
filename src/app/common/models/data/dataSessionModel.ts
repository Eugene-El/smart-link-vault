import { DataTabModel } from './dataTabModel';
import { UniqIconUrlModel } from './uniqIconUrlModel';

export class DataSessionModel {

    constructor(
        public id: string,
        public name: string,
        public tabs: Array<DataTabModel>,
        public uniqIconUrls: Array<string> | Array<UniqIconUrlModel>,
        public isFavorite: boolean,
        public lastOpen: Date
    ) { }
}
