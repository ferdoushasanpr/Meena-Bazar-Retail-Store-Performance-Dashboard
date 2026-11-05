import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogBox } from './dialog-box';

describe('DialogBox', () => {
  let component: DialogBox;
  let fixture: ComponentFixture<DialogBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBox],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
