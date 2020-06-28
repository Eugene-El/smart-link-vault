import { Component, OnInit } from '@angular/core';
import { ChromeService } from 'src/app/common/services/chrome.service';
import { SelectTabModel } from 'src/app/common/models/session/selectTabModel';

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

    this.methods.getTabs();
  
  }

  dataSources = {
    tabs: new Array<SelectTabModel>()
  }

  methods = {
    getTabs: () => {
      this.chromeService.getTabs().then(tabs => {
        this.dataSources.tabs = tabs.map(t => new SelectTabModel(true, t.id, t.title, t.url, t.iconUrl, t.pinned));
      });
    }

  }
}
