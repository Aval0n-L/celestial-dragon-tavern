import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThunderstormComponent } from './thunderstorm.component';

describe('ThunderstormComponent', () => {
  let component: ThunderstormComponent;
  let fixture: ComponentFixture<ThunderstormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThunderstormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThunderstormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
