import { Component, OnInit, Input, HostListener, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { SelectModel } from '../../models/selectModel';

@Component({
  selector: 'slv-select',
  templateUrl: './slv-select.component.html',
  styleUrls: ['./slv-select.component.css']
})
export class SlvSelectComponent implements OnInit {

  @Input() dataSource: Array<SelectModel>;

  @Input() selectedElement: SelectModel;
  @Output() selectedElementChange = new EventEmitter<SelectModel>();

  @Input() selectedId: number | string;
  @Output() selectedIdChange = new EventEmitter<number | string>();

  constructor(
    private eRef: ElementRef
  ) { }

  ngOnInit() {
    if (this.dataSource == null)
      this.dataSource = new Array<SelectModel>();
    if (this.selectedId != null)
      this.selectedElement = this.dataSource.find(d => d.id == this.selectedId);
    setTimeout(() => {
      this.select.nativeElement.style.width = this.select.nativeElement.offsetWidth + "px";
    })
  }

  @ViewChild('select') select;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.page.isOpen = false;
    }
  }
  
  page = {
    isOpen: false as boolean,
    isOpenUp: false as boolean,
    selectPopupMaxHeight: null as number
  }

  method = {
    toggleOpenes: () => {
      this.page.isOpen = !this.page.isOpen;
      if (this.page.isOpen) {
        let verticalPosition = this.select.nativeElement.getBoundingClientRect().y;
        let windowHeight = window.innerHeight;

        this.page.isOpenUp = verticalPosition > (windowHeight / 2);
        this.page.selectPopupMaxHeight = (this.page.isOpenUp ? verticalPosition :
          windowHeight - verticalPosition - 36) - 12;
      }
    },
    select: (item: SelectModel) => {
      this.selectedElement = item;
      this.selectedId = item.id;
      this.selectedElementChange.emit(this.selectedElement);
      this.selectedIdChange.emit(this.selectedId);
      this.page.isOpen = false;
    }
  }

}
