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

interface Automation {
  aut_id: number;
  // Adicione outras propriedades se necessário
}
interface aut {
  ID: number;
  // Adicione outras propriedades se necessário
}
interface PostCreateUser {
  cmp_system_code: string;
  cmp_name: string;
  cmp_cnpj: string;
  cmp_uf: string;
  cmp_cei: string;
  cmp_docs_path: string;
  cmp_zip_code: string;
  cmp_address: string;
  cmp_neighborhood: string;
  cmp_city: string;
  cmp_number: string;
  cmp_ecac_subject: string;
  cmp_ecac_issuer: string;
  aut_id: number[]; // Atualizado para ser um array de números
}

@Component({
  selector: 'app-create-modal-companie',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './create-modal-companie.component.html',
  styleUrls: ['./create-modal-companie.component.scss']
})
export class CreateModalCompanieComponent {
  activeTab: number = 0; // Aba ativa inicial
  form: FormGroup;
  automationsForm: FormGroup;
  data: PostCreateUser = {
    cmp_system_code: '',
    cmp_name: '',
    cmp_cnpj: '',
    cmp_uf: '',
    cmp_cei: '',
    cmp_docs_path: '',
    cmp_zip_code: '',
    cmp_address: '',
    cmp_neighborhood: '',
    cmp_city: '',
    cmp_number: '',
    cmp_ecac_subject: '',
    cmp_ecac_issuer: '',
    aut_id: [] // Inicializa como array vazio
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
    private dialogRef: MatDialogRef<CreateModalCompanieComponent>
  ) {
    this.form = this.fb.group({
      cmp_system_code: ['', Validators.required],
      cmp_name: ['', Validators.required],
      cmp_cnpj: ['', [Validators.required, this.cnpjValidator.bind(this)]],
      cmp_cei: ['', Validators.required],
      cmp_zip_code: ['', Validators.required],
      cmp_uf: ['', Validators.required],
      cmp_address: ['', Validators.required],
      cmp_number: ['', Validators.required],
      cmp_neighborhood: ['', Validators.required],
      cmp_city: ['', Validators.required],
      cmp_ecac_subject: ['', Validators.required],
      cmp_ecac_issuer: ['', Validators.required],
      cmp_ecac_serial: ['', Validators.required],
      cmp_docs_path: ['', Validators.required],
    });

    this.automationsForm = this.fb.group({
      automations: this.fb.array([]) // FormArray para os checkboxes dinâmicos
    });
    this.fillFormWithData();
    this.createCheckboxes();
  }
  fillFormWithData(): void {
    if (this.dialogData && this.dialogData.companieData && this.dialogData.companieData.length > 0) {
      const companieData = this.dialogData.companieData[0];
      this.form.patchValue({
        cmp_system_code: companieData.cmp_system_code || '',
        cmp_name: companieData.cmp_name || '',
        cmp_cnpj: companieData.cmp_cnpj || '',
        cmp_cei: companieData.cmp_cei || '',
        cmp_zip_code: companieData.cmp_zip_code || '',
        cmp_uf: companieData.cmp_uf || '',
        cmp_address: companieData.cmp_address || '',
        cmp_number: companieData.cmp_number || '',
        cmp_neighborhood: companieData.cmp_neighborhood || '',
        cmp_city: companieData.cmp_city || '',
        cmp_ecac_subject: companieData.cmp_ecac_subject || '',
        cmp_ecac_issuer: companieData.cmp_ecac_issuer || '',
        cmp_ecac_serial: companieData.cmp_ecac_serial || '',
        cmp_docs_path: companieData.cmp_docs_path || '',
      });
    } else {
      console.warn('Não é um item para update', this.dialogData?.companieData);
    }
  }
  createCheckboxes(): void {
    const automationsArray = this.automationsForm.get('automations') as FormArray;
    automationsArray.clear();
    let checkedIds: number[] = this.dialogData.companieData[0]?.automations?.map((automation: Automation) => automation.aut_id) || [];
    this.dialogData.automations.forEach((automation: aut) => {
      const isChecked = checkedIds.includes(automation.ID);
      automationsArray.push(new FormControl(isChecked)); // Cria o checkbox com o valor definido
    });
    checkedIds = []
  }

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  switchTab(index: number): void {
    this.activeTab = index;
  }
  get automationsControls(): FormControl[] {
    return (this.automationsForm.get('automations') as FormArray).controls as FormControl[];
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
      if (this.dialogData.companieData.length > 0) {
        console.warn(this.dialogData.companieData[0].cmp_id);
        let id =this.dialogData.companieData[0].cmp_id
        this.data = {
          ...this.form.value,cmp_id: id,
          aut_id: this.getSelectedAutomationIds()
        };
        this.isLoading = true;
        this.isEditing = true;
        this.putData();

      } else {
        this.data = {
          ...this.form.value,
          aut_id: this.getSelectedAutomationIds()
        };
        this.isLoading = true;
        this.isEditing = true;
        this.postData();
      }
      this.saveButtonClicked = false;
    } else {
      //console.log('Não foi clicado no botão salvar');
    }
  }

  getSelectedAutomationIds(): number[] {
    const selectedIds: number[] = [];
    const automations = this.dialogData?.automations || []; // Protege contra valores undefined ou null

    this.automationsControls.forEach((control, index) => {
      if (control.value) {
        if (index < automations.length) {
          const id = automations[index]?.ID; // Use 'ID' se for maiúsculo
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

  postData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: '1',
      'Content-Type': 'application/json'
    });

    // Realiza a requisição POST
    this.http.post<PostCreateUser>(`${this.environment.apiURL}/companies`, this.data, { headers })
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
  putData(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.dialogData.config.token}`,
      UserId: '1',
      'Content-Type': 'application/json'
    });

    // Realiza a requisição POST
    this.http.put<PostCreateUser>(`${this.environment.apiURL}/companies`, this.data, { headers })
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
  //************ Funções HTML ******************* */

  //******************Funções padronizadas************************ */
  extractErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else {
      return 'Erro desconhecido. Por favor, tente novamente mais tarde.';
    }
  }
}