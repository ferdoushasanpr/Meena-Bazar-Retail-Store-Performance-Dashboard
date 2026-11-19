import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesBreakdown } from './sales-breakdown';

describe('SalesBreakdown', () => {
  let component: SalesBreakdown;
  let fixture: ComponentFixture<SalesBreakdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesBreakdown],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesBreakdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
