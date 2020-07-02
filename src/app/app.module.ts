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

@NgModule({
  declarations: [
    AppComponent,
    IconPipe,
    MenuComponent,
    SaveSessionComponent,
    LoadSessionComponent,
    ConfigurationsComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
