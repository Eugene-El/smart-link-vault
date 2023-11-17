import { Component, OnInit } from '@angular/core';
import { ChromeService } from 'src/app/common/services/chrome.service';
import { SelectTabModel } from 'src/app/common/models/session/selectTabModel';
import { DataService } from 'src/app/common/services/data/data-service';
import { DataSessionModel } from 'src/app/common/models/data/dataSessionModel';
import { DataTabModel } from 'src/app/common/models/data/dataTabModel';
import { LoadingService } from 'src/app/common/services/loading.service';
import { ChromeTabModel } from 'src/app/common/models/chrome/chromeTabModel';
import { Router } from '@angular/router';
import { SessionSelectModel } from 'src/app/common/models/session/sessionSelectModel';
import { UniqIconUrlModel } from 'src/app/common/models/data/uniqIconUrlModel';
import { SelectGroupModel } from 'src/app/common/models/session/selectGroupsModel';

@Component({
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
    groups: new Array<SelectGroupModel>(),
    sessions: new Array<SessionSelectModel>()
  }

  methods = {
    getData: () => {

      let getTabs = this.chromeService.getTabs();
      let getGroups = this.chromeService.getGroups();
      let checked = sessionStorage.getItem("checked");
      getTabs.then((tabs) => {
        if (tabs.length <= 1 && checked == null) {
          this.router.navigate(['load']);
        }
        sessionStorage.setItem("checked", "true");
      });
      this.loadingService.handlePromise(Promise.all([
        getTabs,
        getGroups,
        this.dataService.getAll()
      ])).then(([tabs, groups, sessions]) => {
        this.dataSources.groups = [
          new SelectGroupModel("Pinned", "none", tabs.filter(t => t.pinned).map(this.methods.mapTab)),
          ...groups.map(g => new SelectGroupModel(g.title, g.color, tabs.filter(t => t.groupId == g.id).map(this.methods.mapTab)))
            .sort((g1, g2) => g1.minTabindex - g2.minTabindex),
          new SelectGroupModel("Tabs", "none", tabs.filter(t => !t.pinned && t.groupId === -1).map(this.methods.mapTab))
        ].filter(g => g.tabs.length > 0);
        this.dataSources.sessions = sessions.map(s => new SessionSelectModel(s.id, s.name, s.isFavorite));
      });
    },
    mapTab: (tab: ChromeTabModel): SelectTabModel => {
      return new SelectTabModel(true, tab.id, tab.index, tab.title, tab.url, tab.iconUrl, tab.pinned);
    },
    areAllTablsSelected: (): boolean => {
      return this.dataSources.groups.every(g => g.tabs.every(t => t.selected));
    },
    selectAll: () => {
      const selectAll = !this.methods.areAllTablsSelected();
      this.dataSources.groups.forEach(g => g.tabs.forEach(t => t.selected = selectAll));
    },
    selectGroup: (group: SelectGroupModel) => {
      const selectAll = !group.allSelected;
      group.tabs.forEach(t => t.selected = selectAll);
    },
    onSaveClick: () => {
      this.page.isSaving = true;
      setTimeout(() => {
        document.getElementById("sessionName")?.focus();
      })
    },
    save: () => {
      let dataSessionModel = new DataSessionModel(null, null,
        this.methods.calculateUniqUrls(), false, new Date());
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
      
      let index = 0;
      const tabs = [];
      this.dataSources.groups.forEach(g => g.tabs.filter(t => t.selected).forEach(t => tabs.push(t)));
      tabs.forEach(tab => {
        let uniqUrl = uniqUrls.find(uu => uu.url == tab.iconUrl
          || uu.tabs.some(t => this.methods.getHostName(t.url) == this.methods.getHostName(tab.iconUrl)));

        const datatabModel = new DataTabModel(index, tab.url, tab.pinned);
        if (uniqUrl)
          uniqUrl.tabs.push(datatabModel);
        else
          uniqUrls.push(new UniqIconUrlModel(tab.iconUrl, [datatabModel]));
        index++;
      });

      return uniqUrls;
    },
    getHostName: (url: string): string => {
      return url ? new URL(url).hostname : null;
    },
    clear: () => {
      this.page.isSaving = false;
      this.page.isUpdating = false;
      this.page.sessionName = "";
      this.page.sessionId = "";
    }
  }
}
