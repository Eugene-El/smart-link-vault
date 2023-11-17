export class SelectTabModel {

    constructor(
        public selected: boolean,
        public id: number,
        public index: number,
        public title: string,
        public url: string,
        public iconUrl: string,
        public pinned: boolean
    ) { }

}
