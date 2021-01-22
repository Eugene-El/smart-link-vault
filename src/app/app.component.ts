import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from './common/services/loading.service';

@Component({
  styleUrls: ['./app.component.css'],
  selector: 'slv-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  constructor(
    private loadingService: LoadingService,
    private cdRef : ChangeDetectorRef,
    private router: Router
  ) {
    this.loadingService.onLoadingChange.subscribe((value) => {
      this.page.isLoading = value;
      this.cdRef.detectChanges();
    });
  }

  page = {
    isLoading: false as boolean,
    allowOnlyConfiguration: false as boolean
  }

  methods = {
  }
}
