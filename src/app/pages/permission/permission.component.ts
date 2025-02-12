import { Component, OnInit } from '@angular/core';
import { PermissionService } from './permission.service';
import { TableColumn } from 'src/app/shared/components/table/table.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MenuService } from '../menu/menu.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements OnInit {
  tableColumns: { field: string; header: string }[] = [];
  permissionsData: any[] = [];
  isLoading: boolean = true;
  submitted: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 9;

  isModalOpen: boolean = false;
  modalTitle: string = '';
  formPermission!: FormGroup;
  modalData: any = {};
  modalType: 'new' | 'edit' = 'new';
  userId: any = '';

  menuOptions: Array<{ name: string; value: any }> = [];

  constructor(
    private permissionService: PermissionService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('usr_id');
    this.fetchPermissions(this.userId);
    this.loadMenus(this.userId);
    this.setupColumns();
    this.formPermission = new FormGroup({
      pms_action: new FormControl('', Validators.required),
      pms_description: new FormControl('', Validators.required),
      pms_status_mnu: new FormControl('', Validators.required),
      pms_status: new FormControl('', Validators.required),
    });
  }

  fetchPermissions(userId: string) {
    this.permissionService.getPermissions(userId).subscribe({
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

  loadMenus(userId: string): void {
    this.menuService
      .getMenus(userId)
      .pipe(
        map((response: any) => {
          return response.data.map((menu: any) => ({
            name: menu.mnu_label,
            value: menu.mnu_id,
          }));
        })
      )
      .subscribe(
        (options) => {
          this.menuOptions = options;
        },
        (error) => {
          console.error('Erro ao carregar os menus:', error);
        }
      );
  }

  setupColumns() {
    this.tableColumns = [
      {
        field: 'pms_status',
        header: 'Status',
        formatter: (rowData: any) => this.formatStatus(rowData.pms_status),
      },
      { field: 'pms_action', header: 'Nome da permissão' },
      { field: 'pms_description', header: 'Descrição' },
      {
        field: 'pms_updated_at',
        header: 'Última Atualização',
        formatter: (rowData: any) => this.formatDate(rowData.pms_updated_at),
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
    this.formPermission.reset();
    this.isModalOpen = true;
  }

  onEdit(item: any) {
    this.modalType = 'edit';
    this.modalTitle = 'Editar permissão';
    this.formPermission.patchValue(item);
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
          this.permissionService
            .deletePermission(permissionId, userId)
            .subscribe(() => {
              this.permissionsData = this.permissionsData.filter(
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
    if (this.formPermission.valid) {
      const formData = this.formPermission.value;
      if (this.modalType === 'new') {
        console.log('Cadastrando:', formData);
      } else if (this.modalType === 'edit') {
        console.log('Editando:', formData);
      }
      this.isModalOpen = false;
    }
  }

  get pms_action() {
    return this.formPermission.get('pms_action');
  }

  get pms_description() {
    return this.formPermission.get('pms_description');
  }

  get pms_status() {
    return this.formPermission.get('pms_status');
  }

  get pms_status_mnu() {
    return this.formPermission.get('pms_status_mnu');
  }

  isFieldInvalid(fieldName: string): any {
    const control = this.formPermission.get(fieldName);
    return control && control.invalid && (control.touched || this.submitted);
  }

  getControl(controlName: string): FormControl {
    return this.formPermission.get(controlName) as FormControl;
  }
}
