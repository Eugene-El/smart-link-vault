import { Component, OnInit } from '@angular/core';
import { ChromeService } from 'src/app/common/services/chrome.service';

@Component({
  selector: 'slv-save-session',
  templateUrl: './save-session.component.html',
  styleUrls: ['./save-session.component.css']
})
export class SaveSessionComponent implements OnInit {

  constructor(
    private chromeService: ChromeService
  ) { }

  ngOnInit() {
    this.chromeService.getTabs().then(tabs => {
      console.log(tabs);
    });
  }

}
