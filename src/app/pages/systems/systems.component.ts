import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { StandardCrudeComponent } from 'src/app/shared/components/standard-crude/standard-crude.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CRUDInterface } from '../../shared/interfaces/CRUD.interface'
import { Data, SystemResponse } from '../../shared/interfaces/systems.interfaces'
import { NavigationService } from '../../core/services/nav/nav.servevice';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-systems',
  standalone: true,
  imports: [StandardCrudeComponent, SharedModule],
  templateUrl: './systems.component.html',
  styleUrl: './systems.component.scss'
})
export class SystemsComponent {
  data: Data[] = [];
  environment = environment;
  errorMessage: string = '';
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'Adeste',
    page: 'Sistemas',
    modal: 'system-modal',
    token: '',
    userId: '',
    environment: this.environment.apiURL,
    apiRoute: 'systems',
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
      this.crudConfig.userId = userId
      //console.log(environment)      
      this.http
        .get<SystemResponse>(`${this.environment.apiURL}/${this.crudConfig.apiRoute}`, { headers })
        .subscribe(
          (response: SystemResponse) => {
            this.data = response.data.map(item => ({
              'Status': item.sys_status,
              'ID': item.sys_id,
              'Nome': item.sys_name,
              'Descrição': item.sys_description,
              'Credencial': item.sys_credential,
              'Secret': item.sys_secret,
              'URL': item.sys_url,
              'Segurança': item.sys_security,
              'Pasta': item.sys_path,
              'Data criação': item.sys_created_at,
              'Data atualização': item.sys_updated_at,
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
