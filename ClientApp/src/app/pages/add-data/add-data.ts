import { Component } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  imports: [PageHeader],
  selector: 'app-add-data',
  styleUrl: './add-data.css',
  templateUrl: './add-data.html',
})
export class AddData {
  //Page Header Component Info
  pageHeaderTitle = "Add Data";
  pageHeaderSubtitle = "Upload and manage your data sources to power insightful analytics, accurate reporting, and meaningful business insights.";
}
