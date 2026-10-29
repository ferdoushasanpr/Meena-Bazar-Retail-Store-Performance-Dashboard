import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryMatrixChart } from './category-matrix-chart';

describe('CategoryMatrixChart', () => {
  let component: CategoryMatrixChart;
  let fixture: ComponentFixture<CategoryMatrixChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMatrixChart],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryMatrixChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
