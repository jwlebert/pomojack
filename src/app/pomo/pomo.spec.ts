import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pomo } from './pomo';

describe('Pomo', () => {
  let component: Pomo;
  let fixture: ComponentFixture<Pomo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pomo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pomo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
