import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legend-modal',
  templateUrl: './legend-modal.component.html',
  styleUrls: ['./legend-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule] // Incluindo SharedModule
})
export class LegendModalComponent implements AfterViewInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, details: any[] }, private dialogRef: MatDialogRef<LegendModalComponent>) {
    // Configura o dataSource e as colunas dinamicamente
    this.dataSource = new MatTableDataSource(data.details);
    this.displayedColumns = data.details.length > 0 ? Object.keys(data.details[0]) : []; // Dynamically create columns
  }

  ngAfterViewInit(): void {
    // Rola para o topo do conteúdo do modal
    this.scrollToTop();
  }

  scrollToTop(): void {
    if (this.tableContainer) {
      const container = this.tableContainer.nativeElement;
      container.scrollTop = 0; // Rola para o topo
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  exportData(): void {
    // Implement your export logic here
    console.log('Exporting data:', this.data.details);
  }
}