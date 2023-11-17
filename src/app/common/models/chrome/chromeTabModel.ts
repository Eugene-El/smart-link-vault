export class ChromeTabModel {

    constructor(
        public id: number,
        public index: number,
        public title: string,
        public url: string,
        public iconUrl: string,
        public pinned: boolean,
        public groupId: number
    ) { }

}
