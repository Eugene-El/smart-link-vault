
export type GroupColor = "grey" | "blue" | "red" | "yellow" | "green" | "pink" | "purple" | "cyan" | "orange";

export class ChromeGroupModel {

    constructor(
        public id: number,
        public title: string,
        public color: GroupColor
    ) { }

}
