import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportXlsModalComponent } from "../../../../app/modals/import-xls-modal/import-xls-modal.component";
import { SystemModalComponent } from "../../../../app/modals/system-modal/system-modal.component";
import { CustonUsersModalComponent } from "../../../../app/modals/custon-users-modal/custon-users-modal.component";
import { UfModalComponent } from "../../../../app/modals/uf-modal/uf-modal.component";
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CRUDInterface } from '../../interfaces/CRUD.interface';
import { PermissionData, PermissionApiResponse, ApiResponse, UserData } from '../../interfaces/users.interfaces'
import { UfData, ApiUfResponse, PostCreateUF } from '../../interfaces/ufs.interfaces'
import { ProfileResponse, ProfileData } from '../../interfaces/profiles.interfaces'
import { Data, SystemResponse } from '../../interfaces/systems.interfaces'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedModule } from "../../shared.module";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location
import { NavigationService } from '../../../core/services/nav/nav.servevice';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CompanyService } from '../../../core/services/http/update-companie.service'; // Importe o serviço
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiListResponse } from '../../interfaces/list.interfaces';

@Component({
  selector: 'app-standard-crude',
  standalone: true,
  imports: [CommonModule, ImportXlsModalComponent, MatDialogModule, SharedModule, MatTooltipModule],
  templateUrl: './standard-crude.component.html',
  styleUrls: ['./standard-crude.component.scss']
})
export class StandardCrudeComponent implements OnChanges {
  @Input() data: any[] = []; // Dados da tabela
  @Input() config: CRUDInterface = {}; // Configurações adicionais
  @Injectable({
    providedIn: 'root'
  })
  private returnToParentSource = new Subject<void>();
  returnToParent$ = this.returnToParentSource.asObservable();
  isHovered: any = null;
  permissionData: PermissionData[] = []
  systemData: Data[] = []
  userData: UserData[] = []
  ufData: UfData[] = []
  profileData: ProfileData[] = []
  columns: string[] = [];
  paginatedData: any[] = [];
  currentPage = 0;
  pageSize = 9;
  totalPages = 1;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: string | null = null;
  pageTitle: string = '';
  isLoading = false;
  errorMessage: string = '';
  selectedRow: any = null; // Guarda a linha selecionada
  selectedColumn: any = null; // Guarda a coluna selecionada
  isMenuOpen = false; // Controla se o menu de seleção está aberto
  menuPosition = { top: '0px', left: '0px' }; // Guarda a posição do menu

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private location: Location,
    private navigationService: NavigationService,
    private companyService: CompanyService,
  ) { }
  //****************************Session loading data and pages *********************************** */
  //Carrega configurações da Página chamada HTML
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data.length) {
      this.columns = Object.keys(this.data[0]);
      const columnToRemove = 'Pemissoes';
      this.columns = this.columns.filter(column => column !== columnToRemove);
      this.updatePagination();
    }
  }
  openMenu(row: any, column: any, event: MouseEvent) {
    event.preventDefault(); // Evita que o link redirecione a página
    event.stopPropagation(); // Evita que o clique feche automaticamente

    this.selectedRow = row;
    this.selectedColumn = column;
    this.isMenuOpen = true;

    // Posiciona o menu próximo ao clique
    this.menuPosition = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX}px`
    };
  }

  updateStatus(value: boolean, record: any) {
    if (this.selectedRow && this.selectedColumn) {
      this.selectedRow[this.selectedColumn] = value ? 1 : 0; // Atualiza localmente

      // Simula chamada API (substitua pelo seu serviço real)
      this.updateState(this.selectedRow.Placa, this.selectedColumn, value)
        .catch((error) => {
          console.error("Erro ao atualizar:", error);
        });
    }
  }

  async updateState(rowId: number, column: string, value: boolean) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: sessionStorage.getItem('usr_id') || '',  // Tratando null ou undefined
    });
    const body = {
      car_plate: rowId,
      column: column,
      value: value,
    };
    this.isLoading = true;
    this.http
      .put<ApiListResponse>(`${this.config.environment}/uploads`, body, { headers })
      .subscribe(
        (response) => {
          this.toastr.success('Status atualizado com sucesso!');
          this.isMenuOpen = false; // Fecha o menu após atualização
          this.isLoading = false;
          this.closeAndReturn();
        },
        (err) => {
          this.isLoading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
        },
        () => {
          // Define isLoading como false quando o carregamento estiver concluído
          this.isLoading = false;
        }
      );
  }
  closeMenu() {
    this.isMenuOpen = false;
  }


  updatePagination(data: any[] = this.data) {
    this.totalPages = Math.ceil(data.length / this.pageSize);
    this.paginatedData = data.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
    console.log(this.config)
  }
  //Função para buscar um registro nas paginações
  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterData(input.value);
  }
  filterData(search: string) {
    const searchLower = search.toLowerCase();
    const filteredData = this.data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchLower)
      )
    );
    this.updatePagination(filteredData);
  }
  //Finalização e atualização da Pagina 
  // Navegação da Paginação
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  // finalização da navegação da páginação
  // Ordenação das colunas
  sortData(column: string) {
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    const sortedData = [...this.data].sort((a, b) => {
      if (a[column] < b[column]) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    this.updatePagination(sortedData);
  }
  //**************************** End Session loading data and pages ******************************* */
  //****************************Session DialogFlow ************************************************ */
  addRecord() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: sessionStorage.getItem('usr_id') || '',  // Tratando null ou undefined
    });

    if (this.config.modal === 'Custom-Users') {
      this.isLoading = true;
      this.loadPermissions(headers);
    }

    if (this.config.modal === 'uploads') {
      this.isLoading = true;
      this.openDialog()
    }

    if (this.config.modal === 'Ufs') {
      this.isLoading = true;
      this.openDialog()
    }
  }

  upload() {

    this.isLoading = false;
    const dialogRef: MatDialogRef<ImportXlsModalComponent> = this.dialog.open(ImportXlsModalComponent, {
      width: '50%',
      maxWidth: '2000px',
      panelClass: 'custom-dialog-container',
      data: { registerData: this.userData, config: this.config }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.config.customSettings?.refreshPage) {
        this.closeAndReturn();
      }
      this.userData = [];
    });

  }

  editRecord(record: any) {
    const recordObject = record ? JSON.parse(JSON.stringify(record)) : null;
    const id = recordObject?.ID;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: sessionStorage.getItem('usr_id') || '',  // Tratando null ou undefined
    });

    if (this.config.modal === 'Custom-Users') {
      this.isLoading = true;
      this.loadUser(headers, id);
    }

    if (this.config.modal === 'Ufs') {
      this.isLoading = true;
      this.loadUf(headers, id);
    }
  }

  private loadUser(headers: HttpHeaders, id: number) {
    console.log(this.config.apiRoute)
    this.http
      .get<ApiResponse>(`${this.config.environment}/${this.config.apiRoute}/read`, {
        headers,
        params: { usr_id: id.toString() }
      })
      .subscribe(
        (response: ApiResponse) => {
          this.userData = response.data.map(item => ({
            'Status': item.usr_status,
            'ID': item.usr_id,
            'Email': item.usr_email,
            'Nome': item.usr_name,
            'Perfil': item.usr_profile,
            'Pemissoes': item.permissions,
            'Systems': item.systems,
            'usr_ad': item.usr_ad,
            'usr_protheus': item.usr_protheus,
            'usr_sucessFactory': item.usr_sucessFactory,
            'usr_sap': item.usr_sap,
            'usr_vpn': item.usr_vpn,
          }));
          console.log("Dados carregados User Data")
          console.log(this.userData)
          this.loadPermissions(headers);
        },
        (err) => {
          // Manipula erro da busca de automações
          this.handleError(err);
        },
      );
  }
  aguardandoFlag = false; // Variável para indicar quando há "Aguard."

  setAguardando(flag: boolean) {
    this.aguardandoFlag = flag;
    console.log("Aguardando detectado:", this.aguardandoFlag);
  }
  resetAguardando() {
    this.aguardandoFlag = false;
  }

  private loadUf(headers: HttpHeaders, id: number) {
    console.log(this.config.apiRoute)
    this.http
      .get<ApiUfResponse>(`${this.config.environment}/${this.config.apiRoute}/read`, {
        headers,
        params: { uf_id: id.toString() }
      })
      .subscribe(
        (response: ApiUfResponse) => {
          this.ufData = response.data.map(item => ({
            'ID': item.uf_id,
            'UF': item.uf_code,
            'Dias conclusão': item.uf_days,
            'Status': item.uf_state,
            'Nome': item.uf_name,
            'IBGE': item.uf_ibge_code,
            'Região': item.uf_region,
          }));
          console.log("Dados carregados User Data")
          console.log(this.userData)
          this.openDialog();
        },
        (err) => {
          // Manipula erro da busca de automações
          this.handleError(err);
        },
      );
  }

  private loadPermissions(headers: HttpHeaders) {
    this.http
      .get<PermissionApiResponse>(`${this.config.environment}/permissions`, { headers })
      .subscribe(
        (response: PermissionApiResponse) => {
          this.permissionData = response.data.map(item => ({
            'ID': item.pms_id,
            'Ação': item.pms_action,
            'Descrição': item.pms_description,
            'Menu': item.pms_status_mnu,
            'Status': item.pms_status
          }));
          this.loadProfile(headers);
        },
        (err) => {
          // Manipula erro da busca de automações
          this.handleError(err);
        },
      );
  }
  private loadProfile(headers: HttpHeaders) {
    this.http
      .get<ProfileResponse>(`${this.config.environment}/profiles`, { headers })
      .subscribe(
        (response: ProfileResponse) => {
          this.profileData = response.data.map(item => ({
            'ID': item.prf_id,
            'Status': item.prf_status,
            'Nome': item.prf_name,
            'Descrição': item.prf_description,
            'Data criação': item.prf_created_at,
            'Data atualização': item.prf_updated_at,
          }));

          //this.loadSystems(headers);
          this.openDialog();
        },
        (err) => {
          // Manipula erro da busca de automações
          this.handleError(err);
        },
      );
  }

  private openDialog() {
    this.isLoading = false; // Desativa o loading após todas as requisições
    if (this.config.modal === 'Custom-Users') {

      const dialogRef: MatDialogRef<CustonUsersModalComponent> = this.dialog.open(CustonUsersModalComponent, {
        width: '50%',
        maxWidth: '2000px',
        height: '75%',
        panelClass: 'custom-dialog-container',
        data: {
          registerData: this.userData,
          registerDataSecoundSheet: this.permissionData,
          registerDatathirdSheet: this.systemData,
          profileData: this.profileData,
          config: this.config
        }
      });
      // Quando o diálogo for fechado
      dialogRef.afterClosed().subscribe(() => {
        this.closeAndReturn();
        this.permissionData = []
        this.systemData = []
        this.userData = []
        this.profileData = []
      });
    }

    if (this.config.modal === 'Ufs') {

      const dialogRef: MatDialogRef<UfModalComponent> = this.dialog.open(UfModalComponent, {
        width: '50%',
        maxWidth: '2000px',
        height: '75%',
        panelClass: 'custom-dialog-container',
        data: {
          registerData: this.ufData,
          config: this.config
        }
      });
      // Quando o diálogo for fechado
      dialogRef.afterClosed().subscribe(() => {
        this.closeAndReturn();
        this.permissionData = []
        this.systemData = []
        this.userData = []
        this.profileData = []
      });
    }

    if (this.config.modal === 'uploads') {
      const dialogRef: MatDialogRef<ImportXlsModalComponent> = this.dialog.open(ImportXlsModalComponent, {
        width: '50%',
        maxWidth: '2000px',
        height: '40%',
        panelClass: 'custom-dialog-container',
        data: { registerData: '', config: this.config }
      });
      // Quando o diálogo for fechado
      dialogRef.afterClosed().subscribe(() => {
        this.closeAndReturn();
        this.systemData = []
      });
    }
  }
  // Método para tratar erros
  private handleError(err: any) {
    this.isLoading = false;
    this.errorMessage = this.extractErrorMessage(err);
    this.toastr.error(this.errorMessage);
  }
  closeAndReturn() {
    this.navigationService.triggerReturnToParent();
  }

  deleteRecord(record: any) {

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
        const recordObject = record ? JSON.parse(JSON.stringify(record)) : null;
        const id = recordObject?.ID;

        if (this.config.modal == 'Custom-Users') {
          this.isLoading = true;
          this.deleteUser(id)
        }

        if (this.config.modal == 'Ufs') {
          this.isLoading = true;
          this.deleteUf(id)
        }
      }
    });

  }
  deleteSystem(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: sessionStorage.getItem('usr_id') || '',
    });
    const params = { sys_id: id };
    this.http
      .delete<ApiResponse>(`${this.config.environment}/${this.config.apiRoute}`, { headers, params })
      .subscribe(
        (response: ApiResponse) => {
          Swal.fire('Deletado!', 'A permissão foi deletada com sucesso.', 'success');
          this.isLoading = false;
          this.closeAndReturn();
        },
        (err) => {
          this.handleError(err);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  deleteUser(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: sessionStorage.getItem('usr_id') || '',
    });
    const params = { usr_id: id };
    this.http
      .delete<ApiResponse>(`${this.config.environment}/${this.config.apiRoute}/${params.usr_id}`, { headers })
      .subscribe(
        (response: ApiResponse) => {
          Swal.fire('Deletado!', 'O usuário foi deletada com sucesso.', 'success');
          this.isLoading = false;
          this.closeAndReturn();
        },
        (err) => {
          this.handleError(err);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  deleteUf(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: sessionStorage.getItem('usr_id') || '',
    });
    const params = { uf_id: id };
    this.http
      .delete<ApiUfResponse>(`${this.config.environment}/${this.config.apiRoute}/${params.uf_id}`, { headers })
      .subscribe(
        (response: ApiUfResponse) => {
          Swal.fire('Deletado!', 'O usuário foi deletada com sucesso.', 'success');
          this.isLoading = false;
          this.closeAndReturn();
        },
        (err) => {
          this.handleError(err);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  aproveRecord(record: any) {

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Aprovar!',
    }).then((result) => {
      if (result.isConfirmed) {
        const recordObject = record ? JSON.parse(JSON.stringify(record)) : null;
        const id = recordObject?.ID;
        if (this.config.modal == 'imports') {
          this.isLoading = true;
          //this.deleteCompanie(id)
          this.isLoading = false;
        }
      }
    });

  }
  //Mensagem de erro Padrão retorno API
  private extractErrorMessage(err: any): string {
    console.log(err.error.error)
    if (err?.error?.errors?.length) {
      return err.error.errors[0];
    } else if (err?.error?.message) {
      return err.error.message;
    } else if (err.error.error) {
      return err.error.error;
    } {
      return 'Erro desconhecido, por gentileza entrar em contato com o suporte!'
    }
  }
}
