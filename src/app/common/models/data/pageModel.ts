const PLACEHOLDER = "placeholder_placeholder_placeholder_placeholder_placeholder";

export class PageModel {

    public externalIds: Array<string>;
    public nextPageExtenalId: string;

    constructor(
        externalIds: Array<string>,
        nextPageExtenalId: string = PLACEHOLDER
    ) {
        this.externalIds = externalIds;
        this.nextPageExtenalId = nextPageExtenalId;
    }

    public haveNextPage() : boolean {
        return this.nextPageExtenalId != PLACEHOLDER;
    }

    public static from(obj: any): PageModel {
        return new PageModel(obj.externalIds, obj.nextPageExtenalId);
    }

}
