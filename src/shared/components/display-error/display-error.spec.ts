import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayError } from './display-error';

describe('DisplayError', () => {
  let component: DisplayError;
  let fixture: ComponentFixture<DisplayError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
