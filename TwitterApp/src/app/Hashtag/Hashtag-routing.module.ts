import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashtagPage } from './Hashtag.page';

const routes: Routes = [
  {
    path: '',
    component: HashtagPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HashtagPageRoutingModule {}
