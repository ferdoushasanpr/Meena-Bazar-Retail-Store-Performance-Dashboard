import { Component } from '@angular/core';
import { Sidebar } from './shared/sidebar/sidebar';
import { Topbar } from './shared/topbar/topbar';

@Component({
  imports: [Sidebar, Topbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
