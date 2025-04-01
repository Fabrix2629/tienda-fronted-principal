import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export default class TablesComponent implements OnInit {
  showButtons = true;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.checkCurrentRoute();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentRoute();
      });
  }

  private checkCurrentRoute(): void {
    this.showButtons =
      !this.router.url.startsWith('/tables/') || this.router.url === '/tables';
  }

  navigateTo(route: string): void {
    this.router.navigate(['tables', route]);
  }

  goBack(): void {
    this.router.navigate(['tables']).then(() => {
      this.showButtons = true;
    });
  }
}
