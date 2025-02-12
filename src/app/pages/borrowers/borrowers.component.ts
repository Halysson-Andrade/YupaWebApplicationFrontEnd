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
  'Codigo da filial': number;
  'STATUS': number;
  'Codigo do sistema': string;
  'Código GPS': string;
  'Nome Tomador': string;
  'CNPJ': string;
  'CNO': string;
  'CEP': string;
  'Cidade': string;
}

interface ApiResponse {
  data: [{
    brr_id:number;
    brc_id:number;
    brr_status:number;
    brr_system_code:string;
    brr_gps_cod:string;
    brr_name:string;
    brr_cnpj:string;
    brr_cno:string;
    brr_zip_code:string;
    brr_city:string;
  }]
}

@Component({
  selector: 'app-borrowers',
  standalone: true,
  imports: [StandardCrudeComponent,SharedModule],
  templateUrl: './borrowers.component.html',
  styleUrl: './borrowers.component.scss'
})
export class BorrowersComponent {
  data: data[] = [];  // Dados simulados para teste
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'vexia',
    page: 'Tomadores',
    modal:'borrowers',
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
    private toastr: ToastrService, 
    private router: Router,) { }
  ngOnInit() {
    this.isLoading = true;
    this.apiRequest();
  }

  apiRequest() {
    
    const token = sessionStorage.getItem('auth_token');
    const userId = sessionStorage.getItem('usr_id');
    if (token && userId) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'UserId': userId
      });
      console.log(environment)      
      this.http
        .get<ApiResponse>(`${this.environment.apiURL}/borrowers`, { headers })
        .subscribe(
          (response: ApiResponse) => {
            this.data = response.data.map(item => ({
              ID: item.brr_id,
              'Codigo da filial': item.brc_id,
              STATUS: item.brr_status,
              'Codigo do sistema': item.brr_system_code,
              'Código GPS': item.brr_gps_cod,
              'Nome Tomador': item.brr_name,
              'CNPJ': item.brr_cnpj,
              'CNO': item.brr_cno,
              'CEP': item.brr_system_code,
              'Cidade': item.brr_city
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
