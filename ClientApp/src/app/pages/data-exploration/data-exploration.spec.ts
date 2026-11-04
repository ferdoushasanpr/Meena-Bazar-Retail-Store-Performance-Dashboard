import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataExploration } from './data-exploration';

describe('DataExploration', () => {
  let component: DataExploration;
  let fixture: ComponentFixture<DataExploration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExploration],
    }).compileComponents();

    fixture = TestBed.createComponent(DataExploration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
