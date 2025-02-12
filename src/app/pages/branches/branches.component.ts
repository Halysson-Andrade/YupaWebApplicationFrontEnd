import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StandardCrudeComponent } from 'src/app/shared/components/standard-crude/standard-crude.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import {CRUDInterface} from '../../shared/interfaces/CRUD.interface'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

// Tipagem para os dados simulados
interface data {
  'ID': number;
  'Codigo da empresa': number;
  'Codigo do sistema': string;
  'Nome da Filial': string;
  'CNPJ': string;
}

interface ApiResponse {
  data: [{
    brc_id:number;
    cmp_id:number;
    brc_system_code:string;
    brc_name:string;
    brc_cnpj:string;
  }]
}
@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [StandardCrudeComponent,SharedModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent {
  data: data[] = [];  // Dados simulados para teste
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'vexia',
    page: 'Filiais',
    modal: 'branches',
    environment: 'production',
    apiRoute: '/api/companies',
    customSettings: {
      enableLogging: true,
      dateFormat: 'DD/MM/YYYY'
    }
  };
  isLoading = false;
  environment = environment;
  errorMessage: string = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.isLoading = true;
    this.apiRequest();
  }

  apiRequest() {
    
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        UserId: '1',
      });
      console.log(environment)      
      this.http
        .get<ApiResponse>(`${this.environment.apiURL}/branches`, { headers })
        .subscribe(
          (response: ApiResponse) => {
            this.data = response.data.map(item => ({
              ID: item.brc_id,
              'Codigo da empresa': item.cmp_id,
              'Codigo do sistema': item.brc_name,
              'Nome da Filial': item.brc_name,
              'CNPJ': item.brc_cnpj
            }));
            
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
    }else {
      console.error('Token de autenticação não encontrado.');
      this.isLoading = false; // Garante que o loader seja ocultado mesmo se o token não for encontrado
    }
  }
  extractErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else {
      return 'Erro desconhecido. Por favor, tente novamente mais tarde.';
    }
  }
}
