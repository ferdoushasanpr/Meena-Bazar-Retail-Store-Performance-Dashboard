import { Component } from '@angular/core';
import { Sidebar } from './shared/sidebar/sidebar';
import { Topbar } from './shared/topbar/topbar';
import { Dashboard } from './pages/dashboard/dashboard';

@Component({
  imports: [Sidebar, Topbar, Dashboard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
