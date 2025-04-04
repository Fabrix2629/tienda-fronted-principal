import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  user: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errors = {
    user: false,
    password: false,
  };
  isSuccessMessage: boolean = false;
  errorMessage: string | null = null;
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly _authService: AuthService,
    private readonly router: Router
  ) {}

  focusPassword(): void {
    this.validateField('user');
    if (!this.errors.user) {
      this.passwordInput.nativeElement.focus();
    }
  }

  validateField(field: 'user' | 'password'): void {
    if (field === 'user') {
      this.errors.user = !this.user.trim();
    } else if (field === 'password') {
      this.errors.password = !this.password.trim();
    }
  }

  clearError(field: 'user' | 'password'): void {
    this.errors[field] = false;
  }

  login(): void {
    this.validateField('user');
    this.validateField('password');

    if (Object.values(this.errors).some((error) => error)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.isSuccessMessage = false;

    this._authService.login(this.user, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccessMessage = true;
        this.errorMessage = '¡Login exitoso! Ingresando al Dashboard...';

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccessMessage = false;
        if (err.status === 401) {
          this.errorMessage = 'Contraseña incorrecta';
        } else if (err.status === 404) {
          this.errorMessage = 'Usuario no registrado';
        } else {
          this.errorMessage =
            'Error al iniciar sesión. Por favor intente nuevamente.';
        }
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
