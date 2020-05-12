import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TweetPage } from './Tweet.page';

const routes: Routes = [
  {
    path: '',
    component: TweetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TweetPageRoutingModule {}
