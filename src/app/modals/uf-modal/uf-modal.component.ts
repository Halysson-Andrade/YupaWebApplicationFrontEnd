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
import { PostCreateUF } from '../../shared/interfaces/ufs.interfaces'

@Component({
  selector: 'app-uf-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './uf-modal.component.html',
  styleUrl: './uf-modal.component.scss'
})
export class UfModalComponent {
  activeTab: number = 0; // Aba ativa inicial
  form: FormGroup;
  data: PostCreateUF = {
    uf_code: '',
    uf_name: '',
    uf_ibge_code: '',
    uf_region: '',
    uf_state: true,
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
    private dialogRef: MatDialogRef<UfModalComponent>
  ) {
  
    this.form = this.fb.group({
      uf_code: ['', Validators.required],
      uf_state: [true, Validators.required],
      uf_name: ['', Validators.required],
      uf_ibge_code: ['', Validators.required],
      uf_region: ['', Validators.required],
    });
    this.saveButtonClicked = false;
    this.fillFormWithData();
  }

  fillFormWithData(): void {
    if (this.dialogData && this.dialogData.registerData && this.dialogData.registerData.length > 0) {
      const registerData = this.dialogData.registerData[0];
      this.form.patchValue({
        uf_code: registerData.UF || '',
        uf_name: registerData.Nome || '',
        uf_ibge_code: registerData.IBGE || '',
        uf_region: registerData.Região || '',
        uf_state: registerData.Status === true || registerData.Status === 'true' // Garante que será booleano
      });
      console.warn('Registro para fill up');
      console.warn(registerData);
    } else {
      console.warn('Não é um item para update', this.dialogData?.registerData);
    }
  }
  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }
  switchTab(index: number): void {
    this.saveButtonClicked = false;
    this.activeTab = index;
  }
  onSaveClick(event: MouseEvent) {
    this.saveButtonClicked = true;
  }

  save(event: SubmitEvent) {
    event.preventDefault();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      console.warn(this.form.value)
      return;
    }

    if (this.saveButtonClicked) {
      if (this.dialogData.registerData.length > 0) {
        console.warn(this.dialogData.registerData[0]);
        let id = this.dialogData.registerData[0].ID
        this.data = {
          ...this.form.value, uf_id: id
        };
        this.isLoading = true;
        this.isEditing = true;
        this.putData();
        this.saveButtonClicked = false;

      } else {
        this.data = {
          ...this.form.value
        };
        this.isLoading = true;
        this.isEditing = true;
        console.warn("Informações do data");
        console.warn(this.data);
        this.postData();
        this.saveButtonClicked = false;
      }
      this.saveButtonClicked = false;
    } else {

    }
  }

  postData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: this.dialogData.config.userId,
      'Content-Type': 'application/json'
    });

    // Realiza a requisição POST
    this.http.post<PostCreateUF>(`${this.environment.apiURL}/${this.dialogData.config.apiRoute}`, this.data, { headers })
      .subscribe({
        next: (response) => {
          //this.postDataAuth();
          this.toastr.success('Usuário cadastrado com sucesso!');
          this.isLoading = false;
          this.closeAndRefresh(); // Fecha o modal e atualiza a tela
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err)
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
        }
      });
  }

  putData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: this.dialogData.config.userId,
      'Content-Type': 'application/json'
    });
    this.http.put<PostCreateUF>(`${this.environment.apiURL}/${this.dialogData.config.apiRoute}`, this.data, { headers })
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
  // Cancela a ação
  cancel(): void {
    //console.log('Cancel action');
    // Aqui você pode adicionar a lógica para cancelar a ação, se necessário
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
