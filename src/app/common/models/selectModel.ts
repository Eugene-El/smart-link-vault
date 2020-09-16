export class SelectModel {

    public id: number | string;
    public title: string;

    constructor(
        id: number | string,
        title: string
    ) {
        this.id = id;
        this.title = title;
    }
}
