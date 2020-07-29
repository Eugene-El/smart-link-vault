import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouteModel } from './models/routeModel';

@Component({
  selector: 'slv-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() allowOnlyConfiguration: boolean;

  constructor() { }
  
  ngOnInit(): void {
    setTimeout(() => this.methods.getRoutes(), 0);
  }
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(this.methods.getRoutes, 0);
  }


  dataSources = {
    routes: new Array<RouteModel>()
  }

  methods = {
    getRoutes: () => {
      this.dataSources.routes = new Array<RouteModel>();
      this.dataSources.routes.push(new RouteModel("save", "Save session", !this.allowOnlyConfiguration,
        this.allowOnlyConfiguration ? "Please, complete mandatory configuration first" : ""));
      this.dataSources.routes.push(new RouteModel("load", "Load session", !this.allowOnlyConfiguration,
        this.allowOnlyConfiguration ? "Please, complete mandatory configuration first" : ""));
      this.dataSources.routes.push(new RouteModel("configurations", "Configurations"));
    }
  }
}
