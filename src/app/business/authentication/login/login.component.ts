import { Component } from '@angular/core';
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

  constructor(private _authService: AuthService, private router: Router) {}

  login(): void {
    this._authService.login(this.user, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error('Login failed', err),
    });
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
