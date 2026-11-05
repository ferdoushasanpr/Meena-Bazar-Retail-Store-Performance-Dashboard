import { Component, input } from '@angular/core';
import { MetricCardProps } from '../../models/props';

@Component({
  imports: [],
  selector: 'app-metric-card',
  styleUrl: './metric-card.css',
  templateUrl: './metric-card.html',
})
export class MetricCard {
  card = input.required<MetricCardProps>();
}
