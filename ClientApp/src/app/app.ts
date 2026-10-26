import { Component } from '@angular/core';
import { Sidebar } from './shared/sidebar/sidebar';

@Component({
  imports: [Sidebar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
