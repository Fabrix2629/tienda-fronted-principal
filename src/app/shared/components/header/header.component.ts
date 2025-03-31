import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user: string = '';
  password: string = '';

  constructor(private _authService: AuthService, private router: Router) {}

  logout(): void {
    this._authService.logout();
  }
}
