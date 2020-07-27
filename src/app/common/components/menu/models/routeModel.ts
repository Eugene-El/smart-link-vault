
export class RouteModel {

    public path: string;
    public title: string;
    public allowed: boolean;
    public notAllowReason: string;

    constructor(
        path: string,
        title: string,
        allowed: boolean = true,
        notAllowReason: string = ""
    ) {
        this.path = path;
        this.title = title;
        this.allowed = allowed;
        this.notAllowReason = notAllowReason;
    }
    
}
