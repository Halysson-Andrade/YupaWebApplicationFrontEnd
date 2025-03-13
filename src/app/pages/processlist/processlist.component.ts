import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StandardCrudeComponent } from 'src/app/shared/components/standard-crude/standard-crude.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CRUDInterface } from '../../shared/interfaces/CRUD.interface'
import { ListData, ApiListResponse } from '../../shared/interfaces/list.interfaces'
import { NavigationService } from '../../core/services/nav/nav.servevice';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-processlist',
  standalone: true,
  imports: [StandardCrudeComponent, SharedModule],
  templateUrl: './processlist.component.html',
  styleUrl: './processlist.component.scss'
})
export class ProcesslistComponent {
  data: ListData[] = [];
  environment = environment;
  errorMessage: string = '';
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'almani',
    page: 'Lista de Processos',
    modal: 'processList',
    token: '',
    userId: '',
    environment: this.environment.apiURL,
    apiRoute: 'uploads',
    customSettings: {
      enableLogging: true,
      dateFormat: 'DD/MM/YYYY',
      refreshPage: true
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
        .get<ApiListResponse>(`${this.environment.apiURL}/uploads/data`, { headers })
        .subscribe(
          (response: ApiListResponse) => {
            this.data = response.data.map(item => ({
              'Status': item.impd_status,
              'Placa': item.car_plate,
              'Lote': item.impd_lote,
              'UF ': item.impd_uf_transfer,
              'Inicio': item.impd_start_date,
              'Conclusao ': item.impd_target_date,
              'Kit': item.impd_complete_kit,
              'Restricoes': item.impd_restrition,
              'Debitos': item.impd_debit,
              'Venda': item.impd_sale_com,
              'Vist': item.impd_vistory_complete,
              'Pend': item.impd_saler_pending,
              'CRLV': item.impd_crlv_avaible,
              'Troc placa': item.impd_plate_change,
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
