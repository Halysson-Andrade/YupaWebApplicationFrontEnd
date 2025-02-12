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
import { PostCreateUser } from '../../shared/interfaces/users.interfaces'

interface Systems {
  sys_id: number;
}
interface Permissions {
  pms_id: number;
}
interface sys {
  ID: number;
}
interface pms {
  ID: number;
}


@Component({
  selector: 'app-custon-users-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './custon-users-modal.component.html',
  styleUrl: './custon-users-modal.component.scss'
})
export class CustonUsersModalComponent {
  activeTab: number = 0; // Aba ativa inicial
  form: FormGroup;
  permissionsForm: FormGroup;
  systemsForm: FormGroup;
  data: PostCreateUser = {
    usr_email: '',
    usr_ad: '',
    usr_sucessFactory: '',
    usr_protheus: '',
    usr_sap: '',
    usr_vpn: '',
    usr_profile: '',
    usr_name: '',
    usr_status: true,
    pms_id: [], // Inicializa como array vazio
    sys_id: [] // Inicializa como array vazio
  };
  isLoading = false;
  profiles: { id: number; nome: string }[] = []; // Inicializado vazio
  environment = environment;
  errorMessage: string = '';
  isEditing = false;
  private saveButtonClicked = false;
  allPermissionsSelected = false;
  allSystemsSelected = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<CustonUsersModalComponent>
  ) {
    this.form = this.fb.group({
      usr_email: ['', Validators.required],
      usr_ad: ['', Validators.required],
      usr_sucessFactory: ['', Validators.required],
      usr_protheus: ['', Validators.required],
      usr_sap: ['', Validators.required],
      usr_vpn: ['', Validators.required],
      usr_profile: ['', Validators.required],
      usr_status: [true, Validators.required],
      usr_name: ['', Validators.required],
    });
    this.saveButtonClicked = false;
    this.permissionsForm = this.fb.group({
      permissions: this.fb.array([])
    });
    this.systemsForm = this.fb.group({
      systems: this.fb.array([])
    });
    this.fillFormWithData();
    this.fillFormWithProfileData();
    this.createPermissionsCheckboxes();
    this.createSystemsCheckboxes();
  }

  fillFormWithData(): void {
    if (this.dialogData && this.dialogData.registerData && this.dialogData.registerData.length > 0) {
      const userData = this.dialogData.registerData[0];
      this.form.patchValue({
        usr_email: userData.Email || '',
        usr_ad: userData.usr_ad || '',
        usr_sucessFactory: userData.usr_sucessFactory || '',
        usr_protheus: userData.usr_protheus || '',
        usr_sap: userData.usr_sap || '',
        usr_vpn: userData.usr_vpn || '',
        usr_profile: userData.Perfil || '',
        usr_name: userData.Nome || '',
        usr_status: userData.Status === true || userData.Status === 'true' // Garante que será booleano
      });
      console.warn('Registro para fill up');
      console.warn(userData);
    } else {
      console.warn('Não é um item para update', this.dialogData?.registerData);
    }
  }

  fillFormWithProfileData(): void {
    const profileData = this.dialogData?.profileData;
    if (profileData) {
      // Ajuste conforme necessário se `companieData` for um array ou um único objeto
      this.profiles = profileData.map((profile: any) => ({
        id: profile.ID,
        nome: profile.Nome
      }));
    }
  }

  createPermissionsCheckboxes(): void {
    const permissionsArray = this.permissionsForm.get('permissions') as FormArray;
    permissionsArray.clear();
    const checkedIds: number[] = this.dialogData.registerData[0]?.Pemissoes || [];
    this.dialogData.registerDataSecoundSheet.forEach((permission: pms, index: number) => {
      const isChecked = checkedIds.includes(permission.ID);
      permissionsArray.push(new FormControl(isChecked));
    });
  }

  createSystemsCheckboxes(): void {
    const systemsArray = this.systemsForm.get('systems') as FormArray;
    systemsArray.clear();
    const checkedIds: number[] = this.dialogData.registerData[0]?.Systems || [];
    this.dialogData.registerDatathirdSheet.forEach((system: sys, index: number) => {
      const isChecked = checkedIds.includes(system.ID);
      systemsArray.push(new FormControl(isChecked));
    });
  }


  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }
  switchTab(index: number): void {
    this.saveButtonClicked = false;
    this.activeTab = index;
  }
  get systemsControls(): FormControl[] {
    return (this.systemsForm.get('systems') as FormArray).controls as FormControl[];
  }

  get permissionsControls(): FormControl[] {
    return (this.permissionsForm.get('permissions') as FormArray).controls as FormControl[];
  }
  onSaveClick(event: MouseEvent) {
    this.saveButtonClicked = true;
  }

  save(event: SubmitEvent) {
    event.preventDefault();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    if (this.saveButtonClicked) {
      if (this.dialogData.registerData.length > 0) {
        console.warn(this.dialogData.registerData[0]);
        let id = this.dialogData.registerData[0].ID
        this.data = {
          ...this.form.value, usr_id: id,
          sys_id: this.getSelectedSystemsIds(),
          pms_id: this.getSelectedPermissionsIds()
        };
        this.isLoading = true;
        this.isEditing = true;
        this.putData();
        this.saveButtonClicked = false;

      } else {
        this.data = {
          ...this.form.value,
          sys_id: this.getSelectedSystemsIds(),
          pms_id: this.getSelectedPermissionsIds()
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
      //console.log('Não foi clicado no botão salvar');
    }
  }

  postData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: this.dialogData.config.userId,
      'Content-Type': 'application/json'
    });

    // Realiza a requisição POST
    this.http.post<PostCreateUser>(`${this.environment.apiURL}/${this.dialogData.config.apiRoute}`, this.data, { headers })
      .subscribe({
        next: (response) => {
          this.postDataAuth();
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err)
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
        }
      });
  }
  postDataAuth(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: this.dialogData.config.userId,
      'Content-Type': 'application/json'
    });

    // Realiza a requisição POST
    this.http.post<PostCreateUser>(`${this.environment.apiURL}/auth`, this.data, { headers })
      .subscribe({
        next: (response) => {
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

    // Realiza a requisição POST
    
    this.http.put<PostCreateUser>(`${this.environment.apiURL}/${this.dialogData.config.apiRoute}`, this.data, { headers })
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

  getSelectedSystemsIds(): number[] {
    const selectedIds: number[] = [];
    const systems = this.dialogData?.registerDatathirdSheet || []; // Protege contra valores undefined ou null

    this.systemsControls.forEach((control, index) => {
      if (control.value) {
        if (index < systems.length) {
          const id = systems[index]?.ID; // Use 'ID' se for maiúsculo
          if (id != null && !isNaN(id)) {
            selectedIds.push(id);
          } else {
            console.warn('ID inválido para o índice:', index, 'ID:', id);
          }
        } else {
          console.warn('Índice fora do intervalo de automations:', index);
        }
      }
    });
    return selectedIds;
  }

  getSelectedPermissionsIds(): number[] {
    const selectedIds: number[] = [];
    const permissions = this.dialogData?.registerDataSecoundSheet || []; // Protege contra valores undefined ou null

    this.permissionsControls.forEach((control, index) => {
      if (control.value) {
        if (index < permissions.length) {
          const id = permissions[index]?.ID; // Use 'ID' se for maiúsculo
          if (id != null && !isNaN(id)) {
            selectedIds.push(id);
          } else {
            console.warn('ID inválido para o índice:', index, 'ID:', id);
          }
        } else {
          console.warn('Índice fora do intervalo de automations:', index);
        }
      }
    });
    return selectedIds;
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

  //************ Funções HTML ******************* */
  // Validador CNPJ
  formatCNPJ(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
    if (value.length <= 14) {
      value = value
        .replace(/^(\d{2})(\d{3})/, '$1.$2.')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})/, '$1.$2.$3/')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{1,4})/, '$1.$2.$3/$4-')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{1,4})-(\d{0,2})/, '$1.$2.$3/$4-$5');
    }
    event.target.value = value;
    this.form.get('cmp_cnpj')?.setValue(value, { emitEvent: false });
  }
  cnpjValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/\D/g, ''); // Remove máscara
    if (value && value.length !== 14) {
      return { invalidCNPJ: true };
    }
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (control.value && !regex.test(control.value)) {
      return { invalidCNPJ: true };
    }
    return null;
  }
  // Busca o endereço com base no CEP
  onCepBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const cep = inputElement.value;
    this.fetchAddress(cep);
  }

  fetchAddress(cep: string): void {
    const cepWithoutMask = cep.replace(/\D/g, ''); // Remove máscara
    if (cepWithoutMask.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cepWithoutMask}/json/`).subscribe(
        (response) => {
          if (response) {
            this.form.patchValue({
              cmp_address: response.logradouro || '',
              cmp_neighborhood: response.bairro || '',
              cmp_city: response.localidade || '',
              cmp_uf: response.uf || ''
            });
          }
        },
        (error) => {
          console.error('Erro ao buscar endereço:', error);
        }
      );
    }
  }

  toggleAllPermissions(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allPermissionsSelected = isChecked;
    this.permissionsControls.forEach(control => control.setValue(isChecked));
  }

  toggleAllSystems(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allSystemsSelected = isChecked;
    this.systemsControls.forEach(control => control.setValue(isChecked));
  }
  //************ Funções HTML ******************* */

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
