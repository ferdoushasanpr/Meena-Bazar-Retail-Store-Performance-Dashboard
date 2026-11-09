import { TestBed } from '@angular/core/testing';
import { ReportExporter } from './report-exporter';

describe('ReportExporter', () => {
  let service: ReportExporter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportExporter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
