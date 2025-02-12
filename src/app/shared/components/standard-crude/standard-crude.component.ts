import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateModalCompanieComponent } from "../../../modals/create/create-modal-companie/create-modal-companie.component";
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CRUDInterface } from '../../interfaces/CRUD.interface';
import {ApiCompanieResponse,AutomarionData,ApiResponse,CompanieData  } from '../../interfaces/companie.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedModule } from "../../shared.module";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location
import { NavigationService } from '../../../core/services/nav/nav.servevice';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CompanyService } from '../../../core/services/http/update-companie.service'; // Importe o serviço

@Component({
  selector: 'app-standard-crude',
  standalone: true,
  imports: [CommonModule, CreateModalCompanieComponent, MatDialogModule, SharedModule],
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
  autData: AutomarionData[] = [];
  companieData: CompanieData[] = [];
  columns: string[] = [];
  paginatedData: any[] = [];
  currentPage = 0;
  pageSize = 15;
  totalPages = 1;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: string | null = null;
  pageTitle: string = '';
  isLoading = false;
  errorMessage: string = '';

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
      this.updatePagination();
    }
  }
  updatePagination(data: any[] = this.data) {
    this.totalPages = Math.ceil(data.length / this.pageSize);
    this.paginatedData = data.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
  }
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
      UserId: '1',
    });
    if (this.config.modal === 'companies') {
      this.isLoading = true;
      this.loadAutomations(headers);
    }
  }

  editRecord(record: any) {
    const recordObject = record ? JSON.parse(JSON.stringify(record)) : null;
    const id = recordObject?.ID;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: '1',
    });
  
    if (id && this.config.modal === 'companies') {
      const params = { cmp_id: id };  
      this.isLoading = true; 
      this.loadCompanies(headers,params);
    }
  }
  private loadCompanies(headers: HttpHeaders, params:{}) {
    this.http
        .get<ApiCompanieResponse>(`${this.config.environment}/companies/read`, { headers, params })
        .subscribe(
          (response: ApiCompanieResponse) => {
            // Manipula a resposta
            this.companieData = response.data.map(item => ({
              cmp_id: item.cmp_id,
              cmp_system_code: item.cmp_system_code,
              cmp_name: item.cmp_name,
              cmp_cnpj: item.cmp_cnpj,
              cmp_uf: item.cmp_uf,
              cmp_cei: item.cmp_cei,
              cmp_docs_path: item.cmp_docs_path,
              cmp_zip_code: item.cmp_zip_code,
              cmp_address: item.cmp_address,
              cmp_neighborhood: item.cmp_neighborhood,
              cmp_city: item.cmp_city,
              cmp_number: item.cmp_number,
              cmp_ecac_subject: item.cmp_ecac_subject,
              cmp_ecac_issuer: item.cmp_ecac_issuer,
              cmp_ecac_serial: item.cmp_ecac_serial,
              automations: item.automations
            }));
  
            // 2. Busca automações após buscar os dados da empresa
            this.loadAutomations(headers);
          },
          (err) => {
            // Manipula erro da busca de empresas
            this.handleError(err);
          }
        );
  }
  // Método separado para buscar automações
  private loadAutomations(headers: HttpHeaders) {
    console.log(this.companieData)
    this.http
      .get<ApiResponse>(`${this.config.environment}/automations`, { headers })
      .subscribe(
        (response: ApiResponse) => {
          this.autData = response.data.map(item => ({
            'ID': item.aut_id,
            'Nome automacao': item.aut_name,
            'params': item.aut_fifth_string_params
          }));
          this.openDialog();
        },
        (err) => {
          // Manipula erro da busca de automações
          this.handleError(err);
        },
        () => {
          this.isLoading = false; // Desativa o loading após todas as requisições
        }
      );
  }
  private openDialog() {
    const dialogRef: MatDialogRef<CreateModalCompanieComponent> = this.dialog.open(CreateModalCompanieComponent, {
      width: '80%',
      maxWidth: '2000px',
      height: '80%',
      panelClass: 'custom-dialog-container', 
      data: { automations: this.autData, config: this.config, companieData: this.companieData } 
    });
  
    // Quando o diálogo for fechado
    dialogRef.afterClosed().subscribe(() => {
      this.closeAndReturn();
      this.autData =[]
      this.companieData =[]
    });
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
    const recordObject = record ? JSON.parse(JSON.stringify(record)) : null;
    const id = recordObject?.ID;
    if(this.config.modal =='companies'){
      this.isLoading = true;
      this.deleteCompanie(id)
    }
  }
  deleteCompanie(id: number){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.config.token}`,
      UserId: '1',
    });
    const params = { cmp_id: id }; 
    this.http
      .delete<ApiResponse>(`${this.config.environment}/companies`, { headers,params })
      .subscribe(
        (response: ApiResponse) => {
          this.toastr.warning('Delete realizado com sucesso!');
          this.isLoading = false;
          this.closeAndReturn();
        },
        (err) => {
          // Manipula erro da busca de automações
          this.handleError(err);
        },
        () => {
          this.isLoading = false; 
        }
      ); 
  }

  //Mensagem de erro Padrão retorno API
  private extractErrorMessage(err: any): string {
    if (err?.error?.errors?.length) {
      return err.error.errors[0];
    } else if (err?.error?.message) {
      return err.error.message;
    } else {
      return 'Erro desconhecido. Por favor, tente novamente mais tarde.';
    }
  }
}
