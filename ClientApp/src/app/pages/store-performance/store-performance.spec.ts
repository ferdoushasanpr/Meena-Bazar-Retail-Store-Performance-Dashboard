import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorePerformance } from './store-performance';

describe('StorePerformance', () => {
  let component: StorePerformance;
  let fixture: ComponentFixture<StorePerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorePerformance],
    }).compileComponents();

    fixture = TestBed.createComponent(StorePerformance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
