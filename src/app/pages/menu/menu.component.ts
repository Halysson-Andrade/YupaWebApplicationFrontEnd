import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MenuService } from './menu.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TableColumn } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  tableColumns: { field: string; header: string }[] = [];
  menusData: any[] = [];
  isLoading: boolean = true;
  submitted: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 9;

  isModalOpen: boolean = false;
  modalTitle: string = '';

  formMenu!: FormGroup;
  modalData: any = {};
  modalType: 'new' | 'edit' = 'new';
  userId: any = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('usr_id');
    this.fetchMenus(this.userId);
    this.setupColumns();
    this.formMenu = new FormGroup({
      mnu_label: new FormControl('', Validators.required),
      mnu_routerlink: new FormControl('', Validators.required),
      mnu_parent: new FormControl('', Validators.required),
    });
  }

  fetchMenus(userId: string) {
    this.menuService.getMenus(userId).subscribe({
      next: (data) => {
        this.menusData = data.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar menus:', error);
        this.isLoading = false;
      },
    });
  }

  setupColumns() {
    this.tableColumns = [
      { field: 'mnu_label', header: 'Nome' },
      {
        field: 'mnu_icon',
        header: 'Ícone',
        formatter: (rowData: any) => this.formatIcon(rowData.mnu_icon),
      },
      { field: 'mnu_routerlink', header: 'Link' },
      {
        field: 'mnu_updated_at',
        header: 'Última Atualização',
        formatter: (rowData: any) => this.formatDate(rowData.mnu_updated_at),
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

  formatIcon(icone: boolean): string {
    return `<i class="${icone}"></i>`;
  }

  openModal(): void {
    this.modalType = 'new';
    this.modalTitle = 'Criar nova permissão';
    this.formMenu.reset();
    this.isModalOpen = true;
  }

  onEdit(item: any) {
    this.modalType = 'edit';
    this.modalTitle = 'Editar permissão';
    this.formMenu.patchValue(item);
    this.isModalOpen = true;
  }

  onDelete(menuId: number): void {
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
          this.menuService.deleteMenu(menuId, userId).subscribe(() => {
            this.menusData = this.menusData.filter(
              (item) => item.id !== menuId
            );

            Swal.fire(
              'Deletado!',
              'O menu foi deletado com sucesso.',
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
    if (this.formMenu.valid) {
      const formData = this.formMenu.value;
      if (this.modalType === 'new') {
        console.log('Cadastrando:', formData);
      } else if (this.modalType === 'edit') {
        console.log('Editando:', formData);
      }
      this.isModalOpen = false;
    }
  }

  get pms_action() {
    return this.formMenu.get('pms_action');
  }

  get pms_description() {
    return this.formMenu.get('pms_description');
  }

  get pms_status() {
    return this.formMenu.get('pms_status');
  }

  get pms_status_mnu() {
    return this.formMenu.get('pms_status_mnu');
  }

  isFieldInvalid(fieldName: string): any {
    const control = this.formMenu.get(fieldName);
    return control && control.invalid && (control.touched || this.submitted);
  }

  getControl(controlName: string): FormControl {
    return this.formMenu.get(controlName) as FormControl;
  }
}
