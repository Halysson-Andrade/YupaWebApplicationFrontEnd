import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { emailValidator } from 'src/app/utils/validators/email.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  environment = environment;
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const email = this.authService.getEmailFromCookie();
    const password = this.authService.getPasswordFromCookie();

    const rememberMe = email !== '' && password !== '';

    this.loginForm = this.fb.group({
      // email: [email, [Validators.required, emailValidator()]],
      email: [email, [Validators.required, Validators.email]],
      password: [password, [Validators.required]],
      rememberMe: [rememberMe],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password, rememberMe } = this.loginForm.value;
      this.authService.login(email, password, rememberMe).subscribe({
        next: () => {
          this.isLoading = false;
          if (this.authService.isChangePasswordRequired()) {
            sessionStorage.setItem('old_password', password);
            this.router.navigate(['/troca-de-senha']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.toastr.error(this.errorMessage);
        },
      });
    } else {
      this.toastr.error('Por favor, insira um e-mail e senhas válidos.');
    }
  }

  isFieldInvalid(fieldName: string): any {
    const control = this.loginForm.get(fieldName);
    return control && control.invalid && (control.touched || this.submitted);
  }

  getControl(controlName: string): FormControl {
    return this.loginForm.get(controlName) as FormControl;
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
