import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindyComponent } from './windy.component';

describe('WindyComponent', () => {
  let component: WindyComponent;
  let fixture: ComponentFixture<WindyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
