import { Component, OnInit } from '@angular/core';
import { ChromeService } from 'src/app/common/services/chrome.service';
import { SelectTabModel } from 'src/app/common/models/session/selectTabModel';
import { SelectModel } from 'src/app/common/models/selectModel';
import { DataService } from 'src/app/common/services/data/data-service';
import { DataSessionModel } from 'src/app/common/models/data/dataSessionModel';
import { DataTabModel } from 'src/app/common/models/data/dataTabModel';
import { LoadingService } from 'src/app/common/services/loading.service';

@Component({
  selector: 'slv-save-session',
  templateUrl: './save-session.component.html',
  styleUrls: ['./save-session.component.css']
})
export class SaveSessionComponent implements OnInit {

  constructor(
    private loadingService: LoadingService,
    private chromeService: ChromeService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.methods.getData();
  }

  page = {
    isSaving: false as boolean,
    isUpdating: false as boolean,

    sessionName: "" as string,
    sessionId: "" as string
  }

  dataSources = {
    tabs: new Array<SelectTabModel>(),
    sessions: new Array<SelectModel>()
  }

  methods = {
    getData: () => {
      this.loadingService.handlePromise(Promise.all([
        this.chromeService.getTabs(),
        this.dataService.getAll()
      ])).then(([tabs, sessions]) => {
        this.dataSources.tabs = tabs.map(t => new SelectTabModel(true, t.id, t.title, t.url, t.iconUrl, t.pinned));
        this.dataSources.sessions = sessions.map(s => new SelectModel(s.id, s.name));
      });
    },
    save: () => {

      let dataSessionModel = new DataSessionModel(null, null,
        this.dataSources.tabs.filter(t => t.selected)
        .map(t => new DataTabModel(t.url, t.pinned)),
        this.dataSources.tabs.map(t => t.iconUrl).filter((v, i, a) => a.indexOf(v) === i).slice(0, 10),
        false, new Date());
      let promise = null as Promise<void>;

      if (this.page.isSaving && this.page.sessionName != "") {

        dataSessionModel.name = this.page.sessionName;
        promise = this.dataService.addNew(dataSessionModel);

      } else if (this.page.isUpdating && this.page.sessionId != "") {
        
        dataSessionModel.id = this.page.sessionId;
        dataSessionModel.name = this.dataSources.sessions.find(s => s.id == this.page.sessionId).title;
        promise = this.dataService.update(dataSessionModel);

      }

      if (promise) {
        this.loadingService.handlePromise(promise).then(() => {
          this.methods.clear();
          this.methods.getData();
        })
      }
    },
    clear: () => {
      this.page.isSaving = false;
      this.page.isUpdating = false;
      this.page.sessionName = "";
      this.page.sessionId = "";
    }
  }
}
