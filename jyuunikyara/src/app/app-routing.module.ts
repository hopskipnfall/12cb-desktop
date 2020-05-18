import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArenaComponent } from './arena/arena.component';
import { StreamViewComponent } from './stream-view/stream-view.component';
import { WinscreenComponent } from './winscreen/winscreen.component';

const routes: Routes = [
  {
    path: '',
    component: ArenaComponent,
  },
  // {
  //   path: 'en/results/:historyEncoding',
  //   redirectTo: 'results/:historyEncoding',
  // },
  // {
  //   path: 'ja/results/:historyEncoding',
  //   redirectTo: 'results/:historyEncoding',
  // },
  {
    path: 'results/:historyEncoding',
    component: WinscreenComponent,
  },
  {
    path: 'g/:historyEncoding',
    component: ArenaComponent,
  },
  {
    path: 'stream/v1',
    component: StreamViewComponent,
  }
  // {
  //   path: '**',
  //   redirectTo: '',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
