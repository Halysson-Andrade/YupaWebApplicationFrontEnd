import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormControl, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

interface PostCreateUser {
  firstDay: string;
  lastDay: string;
  competencia: string;
  fileName: string;
  fileType: string;
  base64: string;
}

interface PutImportation {
  firstDay: string;
  lastDay: string;
  competencia: string;
  ali_is: number;
}

@Component({
  selector: 'app-import-xls-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './import-xls-modal.component.html',
  styleUrls: ['./import-xls-modal.component.scss']
})
export class ImportXlsModalComponent {
  activeTab: number = 0; // Aba ativa inicial
  form: FormGroup;
  data: PostCreateUser = {
    firstDay: '',
    lastDay: '',
    competencia: '',
    fileName: '',
    fileType: '',
    base64: '',
  };
  isLoading = false;
  environment = environment;
  errorMessage: string = '';
  isEditing = false;
  isUpdating = false;
  dtEnd: string = '';
  endDate: Date | null = null;
  dtStart: string = '';
  startDate: Date | null = null;
  dtComp: string = '';
  compDate: Date | null = null;
  file: File | null = null;
  base64String: string | null = null;
  fileName: string = '';
  fileType: string = '';

  private saveButtonClicked = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ImportXlsModalComponent>
  ) {
    this.form = this.fb.group({
    });
    this.fillFormWithData();
  }

  fillFormWithData(): void {
    if (this.dialogData && this.dialogData.imports && this.dialogData.imports.length > 0) {
      const importData = this.dialogData.imports[0];
      this.isUpdating = true;
      console.log('Chegou Aqui para fillForm');
      console.log(importData);
      this.form.patchValue({
        firstDay: importData['Início período de ponto'] || '',
        lastDay: importData['Fim período de ponto'] || '',
        competencia: importData['Competência'] || '',
      });
    } else {
      console.warn('Não é um item para update', this.dialogData?.companieData);
    }
  }

  getControl(name: string): AbstractControl | null {
    console.log('Passou Aqui!');
    return this.form.get(name);
  }

  switchTab(index: number): void {
    this.activeTab = index;
  }

  onSaveClick(event: MouseEvent) {
    this.saveButtonClicked = true;
    this.dialogData.config.customSettings.refreshPage = true;
  }

  async save(event: SubmitEvent) {
    event.preventDefault();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.error('Algum campo não foi preenchido corretamente!');
      return;
    }

    if (!this.isUpdating) {
      if (!this.fileName || this.fileName === '') {
        this.errorMessage = this.extractErrorMessage({
          error: { message: 'Arquivo não selecionado, por gentileza selecione o arquivo!' }
        });
        this.toastr.warning(this.errorMessage);
        return;
      }
    }

    try {
      if (!this.isUpdating) {
        await this.importCsv();
      }
      if (this.saveButtonClicked) {
        if (this.dialogData.registerData.length > 0) {
          // Fazer o Update
          let id = this.dialogData.registerData[0].ID
          this.data = {
            ...this.form.value,
            usr_id: id,
          };
          this.isLoading = true;
          this.isEditing = true;
          //this.putData();
        } else {
          const userId = sessionStorage.getItem('usr_id');
          this.data = {
            ...this.form.value,
            fileName: this.fileName,
            fileType: this.fileType,
            userId: userId,
            base64: this.base64String, // Agora o valor será preenchido corretamente
          };
          this.isLoading = true;
          this.isEditing = true;
          this.postData();
        }
      } else {
        // Ações adicionais se o botão "Salvar" não foi clicado
      }
    } catch (error) {
      console.error('Erro ao gerar Base64:', error);
      this.toastr.error('Falha ao processar o arquivo.');
    }
  }

  postData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: this.dialogData.config.userId,
      'Content-Type': 'application/json'
    });

    this.http.post<PostCreateUser>(`${this.environment.apiURL}/users/imports`, this.data, { headers })
      .subscribe({
        next: (response) => {
          this.toastr.success('Importação Cadastrada com sucesso!');
          this.closeAndRefresh(); // Fecha o modal e atualiza a tela
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
          this.closeAndRefresh(); // Fecha o modal e atualiza a tela
        }
      });
  }

  putData(): void {
    const userId = sessionStorage.getItem('usr_id');
    const token = this.dialogData?.config?.token;

    if (!token) {
      console.error('Token não encontrado!');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`, // Usa uma string vazia se o token não for definido
      'Content-Type': 'application/json',
      ...(userId ? { UserId: userId } : {}) // Adiciona UserId apenas se existir
    });

    this.http.put<PutImportation>(`${this.environment.apiURL}/imports`, this.data, { headers })
      .subscribe({
        next: (response) => {
          this.toastr.success('Importação atualizada com sucesso!');
          this.closeAndRefresh(); // Fecha o modal e atualiza a tela
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
          this.closeAndRefresh(); // Fecha o modal e atualiza a tela
        }
      });
  }

  closeAndRefresh(): void {
    this.isLoading = true;
    this.dialogRef.close(); // Fecha o modal
    this.isLoading = true;
  }

  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

  close(): void {
    this.closeAndRefresh();
    this.dialogData.config.customSettings.refreshPage = false;
    this.isEditing = false;
  }

  onStartDateInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.dtStart = this.formatDateInput(input);
    this.startDate = this.parseDate(this.dtStart);
  }

  onEndDateInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.dtEnd = this.formatDateInput(input);
    this.endDate = this.parseDate(this.dtEnd);
  }

  onCompDateInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.dtComp = this.formatDateInput(input);
    this.compDate = this.parseDate(this.dtComp);
  }

  formatDateInput(value: string): string {
    value = value.replace(/\D/g, '').slice(0, 8); // Limita a 8 dígitos
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
    return value;
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.length !== 10) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) return null;
    return new Date(year, month - 1, day);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
      this.fileName = target.files[0].name; // Define o nome do arquivo
      this.fileType = target.files[0].type;
    } else {
      this.fileName = ''; // Reseta o fileName se nenhum arquivo for selecionado
    }
  }

  importCsv(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const result = event.target?.result;
          if (typeof result === 'string') {
            this.base64String = result.split(',')[1];
            resolve();
          } else {
            reject('Erro ao ler o arquivo');
          }
        };

        reader.onerror = () => {
          reject('Erro ao carregar o arquivo');
        };

        reader.readAsDataURL(this.file);
      } else {
        alert('Por favor, selecione um arquivo CSV primeiro.');
        reject('Arquivo não selecionado');
      }
    });
  }

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
