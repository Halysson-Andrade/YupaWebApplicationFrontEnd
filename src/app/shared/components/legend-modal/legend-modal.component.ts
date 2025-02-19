import { Component, Inject, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeDetectionStrategy } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-legend-modal',
  templateUrl: './legend-modal.component.html',
  styleUrls: ['./legend-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Habilitando OnPush para melhorar a performance
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, SharedModule],
})
export class LegendModalComponent implements AfterViewInit {
  isLoading = true;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string; details: any[] },
    private dialogRef: MatDialogRef<LegendModalComponent>,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.dialogRef.updatePosition({ top: '50px', left: '100px' });

    setTimeout(() => {
      this.displayedColumns = this.data.details.length > 0 ? Object.keys(this.data.details[0]) : [];
      this.dataSource = new MatTableDataSource<any>(this.data.details);
      this.dataSource.paginator = this.paginator;

      this.isLoading = false;
      this.cdr.detectChanges(); // Forçando detecção de mudanças
    }, 500);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Aplicando o filtro
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Método para exportar os dados dinâmicos para Excel
  exportData(): void {
    // Extrair os dados diretamente do dataSource
    const dataToExport = this.dataSource.data;
    
    if (dataToExport.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    console.log('Exportando dados:', dataToExport);

    // Converter os dados em uma planilha Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Criar um novo workbook e adicionar a planilha
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados Exportados');
    
    // Gerar o arquivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Salvar o arquivo
    const fileName = `dados_exportados_${new Date().getTime()}.xlsx`; // Nome único
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName);
  }
}

// Constantes para definir o tipo de arquivo Excel
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
