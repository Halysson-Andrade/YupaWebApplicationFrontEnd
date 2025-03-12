import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StandardCrudeComponent } from 'src/app/shared/components/standard-crude/standard-crude.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CRUDInterface } from '../../shared/interfaces/CRUD.interface'
import { DocumentsData, ApiDocumentsResponse } from '../../shared/interfaces/documents.interfaces'
import { NavigationService } from '../../core/services/nav/nav.servevice';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [StandardCrudeComponent, SharedModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
  data: DocumentsData[] = [];
  environment = environment;
  errorMessage: string = '';
  crudConfig: CRUDInterface = {  // Objeto de configuração
    theme: 'almani',
    page: 'Documents',
    modal: 'Documents',
    token: '',
    userId: '',
    environment: this.environment.apiURL,
    apiRoute: 'Documents',
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
        .get<ApiDocumentsResponse>(`${this.environment.apiURL}/${this.crudConfig.apiRoute}`, { headers })
        .subscribe(
          (response: ApiDocumentsResponse) => {
            this.data = response.data.map(item => ({
              'ID': item.doc_id,
              'UF': item.uf_code,
              'Nome do documento': item.doc_name,
              'Descrição': item.doc_description,
              'Tipo': item.doc_type,
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
