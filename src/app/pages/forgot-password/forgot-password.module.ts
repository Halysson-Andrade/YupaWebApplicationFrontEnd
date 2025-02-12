import { NgModule } from '@angular/core';
import { ForgotPasswordComponent } from './forgot-password.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [ForgotPasswordComponent],
})
export class ForgotPasswordModule {}
