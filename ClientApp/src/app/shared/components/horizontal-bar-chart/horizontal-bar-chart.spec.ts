import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorizontalBarChart } from './horizontal-bar-chart';

describe('HorizontalBarChart', () => {
  let component: HorizontalBarChart;
  let fixture: ComponentFixture<HorizontalBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalBarChart],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalBarChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
