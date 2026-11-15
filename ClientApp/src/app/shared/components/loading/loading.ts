import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-loading',
  styleUrl: './loading.css',
  templateUrl: './loading.html',
})
export class Loading {
  message = input<string>('Loading data...');
}
