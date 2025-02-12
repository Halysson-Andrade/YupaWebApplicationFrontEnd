import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from './change-password.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [CommonModule, SharedModule],
  exports: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
