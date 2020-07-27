import { Component } from '@angular/core';
import { ConfigurationService } from './common/services/configuration.service';
import { Router } from '@angular/router';

@Component({
  styleUrls: ['./app.component.css'],
  selector: 'slv-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  constructor(
    private configurationService: ConfigurationService,
    private router: Router
  ) {
    this.configurationService.getConfiguration()
      .then(configuration => {
        if (configuration == null || configuration.securitySettings.dataStorage == null) {
          this.page.allowOnlyConfiguration = true;
          this.router.navigate(['configurations']);
        }
      })
      .catch(() => {
        this.router.navigate(['configuration']);
      });
  }

  page = {
    allowOnlyConfiguration: false as boolean
  }

}
