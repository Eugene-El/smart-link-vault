import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'slv-checkbox',
  templateUrl: './slv-checkbox.component.html',
  styleUrls: ['./slv-checkbox.component.css']
})
export class SlvCheckboxComponent implements OnInit {

  @Input() value: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
