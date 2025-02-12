import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StandardCrudeComponent } from 'src/app/shared/components/standard-crude/standard-crude.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CRUDInterface } from '../../shared/interfaces/CRUD.interface'
import { CreateModalCompanieComponent } from "../../modals/create/create-modal-companie/create-modal-companie.component";
import { NavigationService } from '../../core/services/nav/nav.servevice';
import { ToastrService } from 'ngx-toastr';


// Tipagem para os dados simulados
interface data {
  'ID': number;
  'Codigo do sistema': string;
  'Nome da empresa': string;
  'CNPJ': string;
  'CEP': string;
  'Cidade': string;
}

interface ApiResponse {
  data: [{
    cmp_id: number;
    cmp_system_code: string;
    cmp_name: string;
    cmp_cnpj: string;
    cmp_zip_code: string;
    cmp_city: string
  }]
}
@Component({
  selector: 'app-companie',
  standalone: true,
  imports: [StandardCrudeComponent, SharedModule, CreateModalCompanieComponent],
  templateUrl: './companie.component.html',
  styleUrls: ['./companie.component.scss']
})
export class CompanieComponent implements OnInit {
  data: data[] = [];  // Dados simulados para teste
  environment = environment;
  errorMessage: string = '';
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'vexia',
    page: 'Empresas',
    modal: 'companies',
    token: '',
    environment: this.environment.apiURL,
    apiRoute: '/api/companies',
    customSettings: {
      enableLogging: true,
      dateFormat: 'DD/MM/YYYY'
    }
  };
  isLoading = false;



  constructor(
    private http: HttpClient,
    private navigationService: NavigationService,
    private toastr: ToastrService, 
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.navigationService.returnToParent$.subscribe(() => {
      // Lógica para retornar para o componente pai
      this.handleReturn();
    });
    this.apiRequest();
  }
  handleReturn() {
    this.apiRequest();
  }
  apiRequest() {

    const token = sessionStorage.getItem('auth_token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        UserId: '1',
      });
      this.crudConfig.token = token
      //console.log(environment)      
      this.http
        .get<ApiResponse>(`${this.environment.apiURL}/companies`, { headers })
        .subscribe(
          (response: ApiResponse) => {
            this.data = response.data.map(item => ({
              ID: item.cmp_id,
              'Codigo do sistema': item.cmp_system_code,
              'Nome da empresa': item.cmp_name,
              'CNPJ': item.cmp_cnpj,
              'CEP': item.cmp_zip_code,
              'Cidade': item.cmp_city
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
    } else {
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