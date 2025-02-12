import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';
import { ionCheckmarkSharp } from '@ng-icons/ionicons';
import { LoadingComponent } from './components/loading/loading.component';
import { TableComponent } from './components/table/table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalComponent } from './components/modal/modal.component';
import { SelectComponent } from './components/select/select.component';
import { TextAreaComponent } from './components/textarea/textarea.component';

@NgModule({
  declarations: [
    InputComponent,
    SelectComponent,
    TextAreaComponent,
    ButtonComponent,
    LoadingComponent,
    TableComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ heroCheck, ionCheckmarkSharp }),
    NgxPaginationModule,
  ],
  exports: [
    InputComponent,
    SelectComponent,
    TextAreaComponent,
    ButtonComponent,
    LoadingComponent,
    TableComponent,
    NgxPaginationModule,
    ModalComponent,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
