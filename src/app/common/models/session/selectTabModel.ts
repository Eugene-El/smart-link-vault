export class SelectTabModel {

    public selected: boolean;
    public id: number;
    public title: string;
    public url: string;
    public iconUrl: string;
    public pinned: boolean;

    constructor(
        selected: boolean,
        id: number,
        title: string,
        url: string,
        iconUrl: string,
        pinned: boolean
    ) {
        this.selected = selected;
        this.id = id;
        this.title = title;
        this.url = url;
        this.iconUrl = iconUrl;
        this.pinned = pinned;
    }
}
