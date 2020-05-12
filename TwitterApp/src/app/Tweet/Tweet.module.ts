import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TweetPageRoutingModule } from './Tweet-routing.module';

import { TweetPage } from './Tweet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TweetPageRoutingModule
  ],
  declarations: [TweetPage]
})
export class TweetPageModule {}
