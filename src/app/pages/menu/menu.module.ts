import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, SharedModule],
  exports: [MenuComponent],
})
export class MenuModule {}
