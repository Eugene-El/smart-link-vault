
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaveSessionComponent } from '../pages/save-session/save-session.component';
import { LoadSessionComponent } from '../pages/load-session/load-session.component';

const routes: Routes = [
    { path: 'save', component: SaveSessionComponent },
    { path: 'load', component: LoadSessionComponent },
    { path: '**', redirectTo: '/save' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }
