import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HashtagPage } from './Hashtag.page';

import { HashtagPageRoutingModule } from './Hashtag-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HashtagPageRoutingModule
  ],
  declarations: [HashtagPage]
})
export class HashtagPageModule {}
