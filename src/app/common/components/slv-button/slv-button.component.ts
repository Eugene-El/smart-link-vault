import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'slv-button',
  templateUrl: './slv-button.component.html',
  styleUrls: ['./slv-button.component.css']
})
export class SlvButtonComponent implements OnInit {

  @Input() icon: string;
  @Input() small: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
