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
import { PostCreateSystem } from '../../shared/interfaces/systems.interfaces'
import { Index, Id } from '../../shared/interfaces/modal.interfaces'

@Component({
  selector: 'app-system-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './system-modal.component.html',
  styleUrl: './system-modal.component.scss'
})
export class SystemModalComponent {
  activeTab: number = 0; // Aba ativa inicial
  form: FormGroup;
  data: PostCreateSystem = {
    sys_name: '',
    sys_description: '',
    sys_status: true,
    sys_credential: '',
    sys_secret: '',
    sys_url: '',
    sys_security: '',
    sys_path: '',
  };
  isLoading = false;
  environment = environment;
  errorMessage: string = '';
  isEditing = false;
  private saveButtonClicked = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<SystemModalComponent>
  ) {
    this.form = this.fb.group({
      sys_name: ['', Validators.required],
      sys_description: ['', Validators.required],
      sys_status: [true, Validators.required],
      sys_credential: ['', Validators.required],
      sys_secret: ['', Validators.required],
      sys_url: ['', Validators.required],
      sys_security: ['', Validators.required],
      sys_path: ['', Validators.required],
    });

    this.fillFormWithData();
  }

  fillFormWithData(): void {
    if (this.dialogData && this.dialogData.registerData && this.dialogData.registerData.length > 0) {
      const registerData = this.dialogData.registerData[0];
      console.log(registerData)
      this.form.patchValue({
        sys_name: registerData.Nome,
        sys_description: registerData.Descrição || '',
        sys_status: registerData.Status ? true : false,  // Define como true para "Ativo" ou false para "Inativo"
        sys_credential: registerData.Credencial || '',
        sys_secret: registerData.Secret || '',
        sys_url: registerData.URL || '',
        sys_security: registerData.Segurança || '',
        sys_path: registerData.Pasta || ''
      });
    } else {
      console.warn('Não é um item para update', this.dialogData?.registerData);
      this.isLoading = false;
    }
  }
  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }
  switchTab(index: number): void {
    this.activeTab = index;
  }
  onSaveClick(event: MouseEvent) {
    this.saveButtonClicked = true;
  }
  closeAndRefresh(): void {
    this.dialogRef.close(); // Fecha o modal
  }
  // Marca todos os campos como tocados para exibir as mensagens de erro
  
  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }
  // Fecha o modal
  close(): void {
    this.closeAndRefresh()
    this.isEditing = false;
  }

  save(event: SubmitEvent) {
    event.preventDefault();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    if (this.saveButtonClicked) {
      if (this.dialogData.registerData.length > 0) {
        console.log(this.dialogData)
        let id =this.dialogData.registerData[0].ID
        this.data = {
          ...this.form.value,sys_id: id
        };
        console.log(this.data)
        this.isLoading = true;
        this.isEditing = true;
        this.putData();
      } else {
        this.data = {
          ...this.form.value
        };
        console.log(this.data)
        this.isLoading = true;
        this.isEditing = true;
        this.postData();
      }
      this.saveButtonClicked = false;
    } else {
      //console.log('Não foi clicado no botão salvar');
    }
  }

  putData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: this.dialogData.config.userId,
      'Content-Type': 'application/json'
    });
    console.log(this.data)
    // Realiza a requisição POST
    this.http.put<PostCreateSystem>(`${this.environment.apiURL}/${this.dialogData.config.apiRoute}`, this.data, { headers })
      .subscribe({
        next: (response) => {
          this.toastr.success('Cadastro atualizado com sucesso!');
          this.isLoading = false;
          this.closeAndRefresh(); // Fecha o modal e atualiza a tela
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
        }
      });
  }

  postData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: this.dialogData.config.userId,
      'Content-Type': 'application/json'
    });

    // Realiza a requisição POST
    this.http.post<PostCreateSystem>(`${this.environment.apiURL}/${this.dialogData.config.apiRoute}`, this.data, { headers })
      .subscribe({
        next: (response) => {
          this.toastr.success('Usuário cadastrado com sucesso!');
          this.isLoading = false;
          this.closeAndRefresh(); // Fecha o modal e atualiza a tela
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
        }
      });
  }

  //******************Funções padronizadas************************ */
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
