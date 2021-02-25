import { UniqIconUrlModel } from './uniqIconUrlModel';

export class DataSessionModel {

    constructor(
        public id: string,
        public name: string,
        public uniqIconUrls: Array<UniqIconUrlModel>,
        public isFavorite: boolean,
        public lastOpen: Date
    ) { }
}
