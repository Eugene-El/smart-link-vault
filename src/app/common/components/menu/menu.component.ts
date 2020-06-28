import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouteModel } from './models/routeModel';

@Component({
  selector: 'slv-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.methods.getRoutes();
  }

  dataSources = {
    routes: new Array<RouteModel>()
  }

  methods = {
    getRoutes: () => {
      this.dataSources.routes = new Array<RouteModel>();
      this.dataSources.routes.push(new RouteModel("save", "Save session"));
      this.dataSources.routes.push(new RouteModel("load", "Load session"));
      this.dataSources.routes.push(new RouteModel("configurations", "Configurations"));
    }
  }
}
