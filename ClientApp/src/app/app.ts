import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Topbar } from './layout/topbar/topbar';
import { AuthService } from './auth/services/auth-service';

@Component({
  imports: [Sidebar, Topbar, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private authService = inject(AuthService);

  showLayout = this.authService.authData;
}
