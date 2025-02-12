import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, SharedModule],
  exports: [UserComponent],
})
export class UserModule {}
