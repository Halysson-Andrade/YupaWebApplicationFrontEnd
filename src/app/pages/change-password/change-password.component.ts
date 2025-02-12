import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  environment = environment;
  changePasswordForm!: FormGroup;
  errorMessage: string = '';
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      const { password, confirmPassword } = this.changePasswordForm.value;
      const userId = JSON.parse(sessionStorage.getItem('usr_id') || 'null');
      const email = JSON.parse(sessionStorage.getItem('usr_email') || 'null');
      const oldPassword = sessionStorage.getItem('old_password');

      this.authService
        .changePassword(userId, email, oldPassword!, password, confirmPassword)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            sessionStorage.removeItem('old_password');
            this.toastr.success('Senha alterada com sucesso!');
            const newToken = response.data.token;
            sessionStorage.setItem('auth_token', newToken);
            this.router.navigate(['/home']);
          },
          error: (err: any) => {
            this.isLoading = false;
            this.errorMessage = this.extractErrorMessage(err);
            this.toastr.error(this.errorMessage);
          },
        });
    } else {
      this.toastr.error('Por favor, insira sua nova senha e a confirme.');
    }
  }

  get password() {
    return this.changePasswordForm.get('password');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  isFieldInvalid(fieldName: string): any {
    const control = this.changePasswordForm.get(fieldName);
    return control && control.invalid && (control.touched || this.submitted);
  }

  getControl(controlName: string): FormControl {
    return this.changePasswordForm.get(controlName) as FormControl;
  }

  onCancel(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private extractErrorMessage(err: any): string {
    if (err?.error?.errors?.length) {
      return err.error.errors[0];
    } else if (err?.error?.message) {
      return err.error.message;
    } else {
      return 'Erro desconhecido. Por favor, tente novamente mais tarde.';
    }
  }
}
