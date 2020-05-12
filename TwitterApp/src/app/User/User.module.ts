import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserPage } from './User.page';

import { UserPageRoutingModule } from './User-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: UserPage }]),
    UserPageRoutingModule,
  ],
  declarations: [UserPage]
})
export class UserPageModule {}
