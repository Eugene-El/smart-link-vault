export class ChromeTabModel {

    public id: number;
    public title: string;
    public url: string;
    public iconUrl: string;
    public pinned: boolean;

    constructor(
        id: number,
        title: string,
        url: string,
        iconUrl: string,
        pinned: boolean
    ) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.iconUrl = iconUrl;
        this.pinned = pinned;
    }

}
