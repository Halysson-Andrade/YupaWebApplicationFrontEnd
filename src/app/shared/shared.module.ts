import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';
import { ionCheckmarkSharp } from '@ng-icons/ionicons';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [InputComponent, ButtonComponent, LoadingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ heroCheck, ionCheckmarkSharp }),
  ],
  exports: [InputComponent, ButtonComponent, LoadingComponent],
})
export class SharedModule {}
