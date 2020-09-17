import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { MenuComponent } from './common/components/menu/menu.component';
import { LoadSessionComponent } from './pages/load-session/load-session.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { SaveSessionComponent } from './pages/save-session/save-session.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconPipe } from './common/pipes/icon.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SlvSelectComponent } from './common/components/slv-select/slv-select.component';
import { HttpClientModule } from '@angular/common/http';
import { SlvLoadingComponent } from './common/components/slv-loading/slv-loading.component';

@NgModule({
  declarations: [
    AppComponent,
    IconPipe,
    SlvSelectComponent,
    SlvLoadingComponent,
    MenuComponent,
    SaveSessionComponent,
    LoadSessionComponent,
    ConfigurationsComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
