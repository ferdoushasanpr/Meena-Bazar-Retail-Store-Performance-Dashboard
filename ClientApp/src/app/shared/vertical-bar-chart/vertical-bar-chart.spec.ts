import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerticalBarChart } from './vertical-bar-chart';

describe('VerticalBarChart', () => {
  let component: VerticalBarChart;
  let fixture: ComponentFixture<VerticalBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalBarChart],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalBarChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
