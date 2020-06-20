import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { MenuComponent } from './common/components/menu/menu.component';
import { LoadSessionComponent } from './pages/load-session/load-session.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { SaveSessionComponent } from './pages/save-session/save-session.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SaveSessionComponent,
    LoadSessionComponent,
    ConfigurationsComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
