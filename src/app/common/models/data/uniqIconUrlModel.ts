import { DataTabModel } from "./dataTabModel";

export class UniqIconUrlModel {

    constructor(
        public url: string,
        public tabs: Array<DataTabModel>
    ) { }
}
