import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';

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

  constructor(private readonly _authService: AuthService) {}

  logout(): void {
    this._authService.logout();
  }
}
