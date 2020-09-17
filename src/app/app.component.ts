import { ChangeDetectorRef, Component } from '@angular/core';
import { ConfigurationService } from './common/services/configuration.service';
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
    private configurationService: ConfigurationService,
    private loadingService: LoadingService,
    private cdRef : ChangeDetectorRef,
    private router: Router
  ) {
    this.methods.getConfigurationStatus();
    this.configurationService.onConfigurationUpdated.subscribe(() => this.methods.getConfigurationStatus());
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
    getConfigurationStatus: () => {
      this.configurationService.getConfiguration()
        .then(configuration => {
          this.page.allowOnlyConfiguration = configuration == null || configuration.securitySettings.dataStorage == null;
          if (this.page.allowOnlyConfiguration)
            this.router.navigate(['configurations']);
        })
        .catch(() => {
          this.router.navigate(['configuration']);
        });
    }
  }
}
