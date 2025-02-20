import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StandardCrudeComponent } from 'src/app/shared/components/standard-crude/standard-crude.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CRUDInterface } from '../../shared/interfaces/CRUD.interface'
import { CreateModalCompanieComponent } from "../../../app/modals/create-modal-companie/create-modal-companie.component";
import { NavigationService } from '../../core/services/nav/nav.servevice';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Timestamp } from 'rxjs';

// Tipagem para os dados simulados
interface data {
  'Status': number;
  'Nome': string;
}

interface coleteData {
  'Status': number;
  'Nome': string;
  'Total Importado': number;
  'Total com Erro': number;
  'Data da Criacão': string;
  'Detail Error': [];
  'Detail no Error': [];
}

interface ApiResponse {
  data: [{
    imp_status: number;
    imp_id: number;
    imp_name: string;
    imp_container_name: string;
    imp_blob_path: string;
    total_imported: number;
    noError: number;
    Error: number;
    ErrorResults: [];
    noErrorResults: [];
    imp_created_at:string;
  }]
}

@Component({
  selector: 'app-uploads',
  standalone: true,
  imports: [StandardCrudeComponent, SharedModule],
  templateUrl: './uploads.component.html',
  styleUrl: './uploads.component.scss'
})
export class UploadsComponent {
  data: data[] = [];
  coleteData: coleteData[] = [];
  environment = environment;
  errorMessage: string = '';
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'almani',
    page: 'Importações',
    modal: 'uploads',
    token: '',
    userId: '',
    environment: this.environment.apiURL,
    apiRoute: 'uploads',
    customSettings: {
      enableLogging: true,
      dateFormat: 'DD/MM/YYYY',
      refreshPage: true,
      array: []
    }
  };
  isLoading = false;
  return = false;
  private navigationSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private navigationService: NavigationService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.navigationSubscription = this.navigationService.returnToParent$.subscribe(() => {
      this.handleReturn();
    });

    if (!this.return) {
      this.return = true;
      console.log("Carregamento inicial");
      this.apiRequest();
    }
  }

  handleReturn() {
    console.log("Executando após retorno");
    this.apiRequest();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  apiRequest() {
    this.isLoading = true;
    const token = sessionStorage.getItem('auth_token');
    const userId = sessionStorage.getItem('usr_id');

    if (token && userId) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'UserId': userId
      });

      this.crudConfig.token = token;
      console.log("Fazendo requisição...");

      this.http
        .get<ApiResponse>(`${this.environment.apiURL}/uploads`, { headers })
        .subscribe(
          (response: ApiResponse) => {
            this.coleteData = response.data.map(item => ({
              'Status': item.imp_status,
              'Nome': item.imp_name,
              'Total Importado': item.total_imported  ?? 0,
              'Total com Erro': item.Error ?? 0,  // Define 0 se não existir
              'Detail Error': item.ErrorResults ?? [],
              'Detail no Error': item.noErrorResults ?? [],
              'Data da Criacão': item.imp_created_at ?? '01/01/01'

            }));
            console.log("Data importação")
            console.log(this.coleteData)
            //this.data = this.coleteData.map(({ 'Detail Error': _, 'Detail no Error': __, ...rest }) => rest);
            this.data = this.coleteData.map(({ 'Detail Error': _, 'Detail no Error': __, ...rest }) => rest);

            this.crudConfig.customSettings = this.crudConfig.customSettings || {};

            if (this.crudConfig.customSettings) {
              this.crudConfig.customSettings.array = this.coleteData;
            }
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            this.errorMessage = this.extractErrorMessage(err);
            this.toastr.error(this.errorMessage);
          }
        );
    } else {
      console.error('Token de autenticação não encontrado.');
      this.isLoading = false;
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
