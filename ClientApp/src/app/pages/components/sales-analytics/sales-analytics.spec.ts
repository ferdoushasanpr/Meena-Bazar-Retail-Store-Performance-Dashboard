import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesAnalytics } from './sales-analytics';

describe('SalesAnalytics', () => {
  let component: SalesAnalytics;
  let fixture: ComponentFixture<SalesAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
