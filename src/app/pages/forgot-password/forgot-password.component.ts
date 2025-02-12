import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { emailValidator } from 'src/app/utils/validators/email.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  environment = environment;
  forgotPasswordForm!: FormGroup;
  errorMessage: string = '';
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.email?.value;
      this.authService.sendForgotPasswordRequest(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('teste', 'Sucesso');
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
        },
      });
    } else {
      this.toastr.error('Por favor, insira um e-mail válido.');
    }
  }

  isFieldInvalid(fieldName: string): any {
    const control = this.forgotPasswordForm.get(fieldName);
    return control && control.invalid && (control.touched || this.submitted);
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }

  getControl(controlName: string): FormControl {
    return this.forgotPasswordForm.get(controlName) as FormControl;
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
