import { GroupColor } from "../chrome/chromGroupModel";
import { SelectTabModel } from "./selectTabModel";

export class SelectGroupModel {

    constructor(
        public title: string,
        public color: GroupColor | "none",
        public tabs: SelectTabModel[]
    ) { }

    get allSelected(): boolean {
        return this.tabs.every(t => t.selected);
    }

    get minTabindex(): number {
        return Math.min(99999, ...this.tabs.map(t => t.index));
    }

}