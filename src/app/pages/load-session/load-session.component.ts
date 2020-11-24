import { Component, OnInit } from '@angular/core';
import { DataSessionModel } from 'src/app/common/models/data/dataSessionModel';
import { UniqIconUrlModel } from 'src/app/common/models/data/uniqIconUrlModel';
import { ChromeService } from 'src/app/common/services/chrome.service';
import { DataService } from 'src/app/common/services/data/data-service';
import { LoadingService } from 'src/app/common/services/loading.service';

@Component({
  selector: 'slv-load-session',
  templateUrl: './load-session.component.html',
  styleUrls: ['./load-session.component.css']
})
export class LoadSessionComponent implements OnInit {

  constructor(
    private loadingService: LoadingService,
    private dataService: DataService,
    private chromeService: ChromeService
  ) { }

  ngOnInit(): void {
    this.methods.getData();
  }

  dataSources = {
    sessions: new Array<DataSessionModel>()
  }

  methods = {
    getData: () => {
      this.loadingService.handlePromise(this.dataService.getAll())
        .then(sessions => {
          this.dataSources.sessions = sessions;
        });
    },
    loadSession: (session: DataSessionModel) => {
      this.loadingService.handlePromise(this.dataService.updateLastOpen(session.id)).then();
      session.tabs.forEach(tab => {
        this.chromeService.openTab(tab.url, tab.pinned);
      });
    },
    setIsfavorite: (session: DataSessionModel) => {
      this.loadingService.handlePromise(this.dataService.updateIsFavorite(session.id, !session.isFavorite))
        .then(() => this.methods.getData());
    },
    delete: (session: DataSessionModel) => {
      this.loadingService.handlePromise(this.dataService.delete(session.id))
        .then(() => this.methods.getData());
    },
    isObject: (obj: string | UniqIconUrlModel) => {
      return obj && typeof obj != "string";
    }
  }

}
