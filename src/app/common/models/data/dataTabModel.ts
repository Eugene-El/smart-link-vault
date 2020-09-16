export class DataTabModel {

    public url: string;
    public pinned: boolean;

    constructor(
        url: string,
        pinned: boolean
    ) {
        this.url = url;
        this.pinned = pinned;
    }
}
