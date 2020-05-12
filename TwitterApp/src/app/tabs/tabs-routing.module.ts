import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'Map',
        loadChildren: () => import('../Map/Map.module').then(m => m.MapPageModule)
      },
      {
        path: 'Hashtag',
        loadChildren: () => import('../Hashtag/Hashtag.module').then(m => m.HashtagPageModule)
      },
      {
        path: 'User',
        loadChildren: () => import('../User/User.module').then(m => m.UserPageModule)
      },
      {
        path: 'Tweet',
        loadChildren: () => import('../Tweet/Tweet.module').then(m => m.TweetPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/Map',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/Map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
