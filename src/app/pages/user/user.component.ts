import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from './user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableColumn } from 'src/app/shared/components/table/table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  tableColumns: { field: string; header: string }[] = [];
  usersData: any[] = [];
  isLoading: boolean = true;
  submitted: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 9;

  isModalOpen: boolean = false;
  modalTitle: string = '';
  formUser!: FormGroup;
  modalData: any = {};
  modalType: 'new' | 'edit' = 'new';
  userId: any = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('usr_id');
    this.fetchUsers(this.userId);
    this.setupColumns();
    this.formUser = new FormGroup({
      usr_email: new FormControl('', Validators.required),
      usr_profile: new FormControl('', Validators.required),
      usr_password: new FormControl('', Validators.required),
      usr_name: new FormControl('', Validators.required),
      permissions: new FormControl('', Validators.required),
    });
  }

  fetchUsers(userId: string) {
    this.userService.getUsers(userId).subscribe({
      next: (data) => {
        this.usersData = data.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar users:', error);
        this.isLoading = false;
      },
    });
  }

  setupColumns() {
    this.tableColumns = [
      {
        field: 'usr_status',
        header: 'Status',
        formatter: (rowData: any) => this.formatStatus(rowData.usr_status),
      },
      { field: 'usr_name', header: 'Nome' },
      { field: 'usr_email', header: 'Email' },
      {
        field: 'usr_updated_at',
        header: 'Última Atualização',
        formatter: (rowData: any) => this.formatDate(rowData.usr_updated_at),
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

  openModal(): void {
    this.modalType = 'new';
    this.modalTitle = 'Criar nova permissão';
    this.formUser.reset();
    this.isModalOpen = true;
  }

  onEdit(item: any) {
    this.modalType = 'edit';
    this.modalTitle = 'Editar permissão';
    this.formUser.patchValue(item);
    this.isModalOpen = true;
  }

  onDelete(permissionId: number): void {
    const userId = sessionStorage.getItem('usr_id');

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (userId) {
          this.userService.deleteUser(permissionId, userId).subscribe(() => {
            this.usersData = this.usersData.filter(
              (item) => item.id !== permissionId
            );

            Swal.fire(
              'Deletado!',
              'A permissão foi deletada com sucesso.',
              'success'
            );
          });
        }
      }
    });
  }

  handleCloseModal(): void {
    this.isModalOpen = false;
  }

  handleConfirmAction(): void {
    if (this.formUser.valid) {
      const formData = this.formUser.value;
      if (this.modalType === 'new') {
        console.log('Cadastrando:', formData);
      } else if (this.modalType === 'edit') {
        console.log('Editando:', formData);
      }
      this.isModalOpen = false;
    }
  }

  get pms_action() {
    return this.formUser.get('pms_action');
  }

  get pms_description() {
    return this.formUser.get('pms_description');
  }

  get pms_status() {
    return this.formUser.get('pms_status');
  }

  get pms_status_mnu() {
    return this.formUser.get('pms_status_mnu');
  }

  isFieldInvalid(fieldName: string): any {
    const control = this.formUser.get(fieldName);
    return control && control.invalid && (control.touched || this.submitted);
  }

  getControl(controlName: string): FormControl {
    return this.formUser.get(controlName) as FormControl;
  }
}
