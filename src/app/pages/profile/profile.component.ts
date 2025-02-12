import { ProfileService } from './profile.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TableColumn } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  tableColumns: { field: string; header: string }[] = [];
  permissionsData: any[] = [];
  isLoading: boolean = true;
  submitted: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 9;

  isModalOpen: boolean = false;
  modalTitle: string = '';
  formProfile!: FormGroup;
  modalData: any = {};
  modalType: 'new' | 'edit' = 'new';
  userId: any = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('usr_id');
    this.fetchPermissions(this.userId);
    this.setupColumns();
  }

  fetchPermissions(userId: string) {
    this.profileService.getProfiles(userId).subscribe({
      next: (data) => {
        this.permissionsData = data.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar permissões:', error);
        this.isLoading = false;
      },
    });
  }

  setupColumns() {
    this.tableColumns = [
      {
        field: 'prf_status',
        header: 'Status',
        formatter: (rowData: any) => this.formatStatus(rowData.prf_status),
      },
      { field: 'prf_name', header: 'Nome perfil' },
      { field: 'prf_description', header: 'Descrição' },
      {
        field: 'prf_updated_at',
        header: 'Última Atualização',
        formatter: (rowData: any) => this.formatDate(rowData.prf_updated_at),
      },
      { field: 'actions', header: 'Ações' },
    ] as TableColumn[];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  formatStatus(status: boolean): string {
    const statusText = status ? 'Ativa' : 'Inativa';
    const statusClass = status ? 'status-active' : 'status-inactive';

    return `<span class="${statusClass}">${statusText}</span>`;
  }

  onEdit(row: any) {
    console.log('Editar linha', row);
    // Implementar lógica de edição
  }

  onDelete(row: any) {
    console.log('Excluir linha', row);
    // Implementar lógica de exclusão
  }
}
