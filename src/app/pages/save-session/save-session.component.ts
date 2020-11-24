import { Component, OnInit } from '@angular/core';
import { ChromeService } from 'src/app/common/services/chrome.service';
import { SelectTabModel } from 'src/app/common/models/session/selectTabModel';
import { SelectModel } from 'src/app/common/models/selectModel';
import { DataService } from 'src/app/common/services/data/data-service';
import { DataSessionModel } from 'src/app/common/models/data/dataSessionModel';
import { DataTabModel } from 'src/app/common/models/data/dataTabModel';
import { LoadingService } from 'src/app/common/services/loading.service';
import { ChromeTabModel } from 'src/app/common/models/chrome/chromeTabModel';
import { Router } from '@angular/router';
import { SessionSelectModel } from 'src/app/common/models/session/sessionSelectModel';
import { UniqIconUrlModel } from 'src/app/common/models/data/uniqIconUrlModel';

@Component({
  selector: 'slv-save-session',
  templateUrl: './save-session.component.html',
  styleUrls: ['./save-session.component.css']
})
export class SaveSessionComponent implements OnInit {

  constructor(
    private loadingService: LoadingService,
    private chromeService: ChromeService,
    private dataService: DataService,
    private router: Router
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
    sessions: new Array<SessionSelectModel>()
  }

  methods = {
    getData: () => {

      let getTabs = this.chromeService.getTabs();
      let checked = sessionStorage.getItem("checked");
      getTabs.then((tabs) => {
        if (tabs.length <= 1 && checked == null) {
          this.router.navigate(['load']);
        }
        sessionStorage.setItem("checked", "true");
      });
      this.loadingService.handlePromise(Promise.all([
        getTabs,
        this.dataService.getAll()
      ])).then(([tabs, sessions] : [Array<ChromeTabModel>, Array<DataSessionModel>]) => {

        this.dataSources.tabs = tabs.map(t => new SelectTabModel(true, t.id, t.title, t.url, t.iconUrl, t.pinned));
        this.dataSources.sessions = sessions.map(s => new SessionSelectModel(s.id, s.name, s.isFavorite));
      });
    },
    save: () => {
      

      let dataSessionModel = new DataSessionModel(null, null,
        this.dataSources.tabs.filter(t => t.selected)
        .map(t => new DataTabModel(t.url, t.pinned)),
        this.methods.calculateUniqUrls(),
        false, new Date());
      let promise = null as Promise<void>;

      if (this.page.isSaving && this.page.sessionName != "") {

        dataSessionModel.name = this.page.sessionName;
        promise = this.dataService.addNew(dataSessionModel);

      } else if (this.page.isUpdating && this.page.sessionId != "") {
        
        const selectedSession = this.dataSources.sessions.find(s => s.id == this.page.sessionId);
        dataSessionModel.id = this.page.sessionId;
        dataSessionModel.name = selectedSession.title;
        dataSessionModel.isFavorite = selectedSession.isFavorite;
        promise = this.dataService.update(dataSessionModel);

      }

      if (promise) {
        this.loadingService.handlePromise(promise).then(() => {
          this.router.navigate(['load']);
        })
      }
    },
    calculateUniqUrls: (): Array<UniqIconUrlModel> => {
      let uniqUrls = new Array<UniqIconUrlModel>();
      
      this.dataSources.tabs.filter(t => t.selected)
        .map(t => t.iconUrl).forEach(iconUrl => {
          let uniqUrl = uniqUrls.find(uu => uu.url == iconUrl);
          if (uniqUrl)
            uniqUrl.count++;
          else
            uniqUrls.push(new UniqIconUrlModel(iconUrl, 1));
      });

      return uniqUrls.slice(0, 10);
    },
    clear: () => {
      this.page.isSaving = false;
      this.page.isUpdating = false;
      this.page.sessionName = "";
      this.page.sessionId = "";
    }
  }
}
