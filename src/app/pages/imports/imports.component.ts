import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StandardCrudeComponent } from 'src/app/shared/components/standard-crude/standard-crude.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CRUDInterface } from '../../shared/interfaces/CRUD.interface'
import { CreateModalCompanieComponent } from "../../../app/modals/create-modal-companie/create-modal-companie.component";
import { NavigationService } from '../../core/services/nav/nav.servevice';
import { ToastrService } from 'ngx-toastr';

// Tipagem para os dados simulados
interface data {
  'Status': number;
  'Inicio período de ponto': string;
  'Fim período de ponto': string;
  'Competência': string;
  'Total Importado': number;
  'Total para processamento': number;
  'Total com Erro': number;
}

interface ApiResponse {
  data: [{
    ali_status: number;
    ali_start_date: string;
    ali_end_date: string;
    ali_comp: string;
    total_imported: number;
    noError: number;
    Error: number;
  }]
}

@Component({
  selector: 'app-imports',
  standalone: true,
  imports: [StandardCrudeComponent, SharedModule, CreateModalCompanieComponent],
  templateUrl: './imports.component.html',
  styleUrl: './imports.component.scss'
})
export class ImportsComponent {
  data: data[] = [];
  environment = environment;
  errorMessage: string = '';
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'vexia',
    page: 'Importações',
    modal: 'imports',
    token: '',
    environment: this.environment.apiURL,
    apiRoute: '/api/imports',
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
    const userId = sessionStorage.getItem('usr_id');
    if (token && userId) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'UserId': userId
      });
      this.crudConfig.token = token
      //console.log(environment)      
      this.http
        .get<ApiResponse>(`${this.environment.apiURL}/imports`, { headers })
        .subscribe(
          (response: ApiResponse) => {
            this.data = response.data.map(item => ({
              'Status': item.ali_status,
              'Inicio período de ponto': item.ali_start_date,
              'Fim período de ponto': item.ali_end_date,
              'Competência': item.ali_comp,
              'Total Importado': item.total_imported,
              'Total para processamento': item.noError,
              'Total com Erro': item.Error
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
