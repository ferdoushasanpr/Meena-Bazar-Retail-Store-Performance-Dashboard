import { Component } from '@angular/core';
import { Sidebar } from './shared/sidebar/sidebar';
import { Topbar } from './shared/topbar/topbar';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [Sidebar, Topbar, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
