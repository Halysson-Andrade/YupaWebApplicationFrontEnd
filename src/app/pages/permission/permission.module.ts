import { NgModule } from '@angular/core';
import { PermissionComponent } from './permission.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PermissionComponent],
  imports: [CommonModule, SharedModule],
  exports: [PermissionComponent],
})
export class PermissionModule {}
