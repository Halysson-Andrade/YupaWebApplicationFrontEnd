import { Component, EventEmitter, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    FormsModule
  ]
})
export class DateFilterComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;

  @Output() filterApplied = new EventEmitter<{ startDate: Date | null; endDate: Date | null }>();

  applyFilter(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione ambas as datas.');
      return;
    }

    this.filterApplied.emit({
      startDate: this.startDate,
      endDate: this.endDate
    });
  }
}