import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn {
  field: string;
  header: string;
  formatter?: (rowData: any) => string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  editRow(row: any) {
    this.edit.emit(row);
  }

  deleteRow(row: any) {
    this.delete.emit(row);
  }

  get paginatedData() {
    return this.data;
  }

  isHTML(value: string): boolean {
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
  }
}
