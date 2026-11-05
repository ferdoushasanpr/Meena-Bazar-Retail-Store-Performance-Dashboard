import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableChart } from './table-chart';

describe('TableChart', () => {
  let component: TableChart;
  let fixture: ComponentFixture<TableChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableChart],
    }).compileComponents();

    fixture = TestBed.createComponent(TableChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
