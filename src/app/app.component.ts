import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  styleUrls: ['./app.component.css'],
  selector: 'slv-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  constructor( private cdref: ChangeDetectorRef ) {}
  
  ngAfterContentChecked() {

    this.methods.getHeight();
    this.cdref.detectChanges();
    
  }

  options = {
    routerHeight: 0 as number
  }

  methods = {
    getHeight: () : void => {
      let height = window.innerHeight;
      let menu = document.getElementsByTagName("slv-menu")[0];
      if (menu != null) {
        height -= menu.clientHeight;
      }
      console.log(height);
      this.options.routerHeight = height;
    }
  }

}
