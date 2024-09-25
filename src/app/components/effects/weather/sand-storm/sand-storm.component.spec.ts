import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandStormComponent } from './sand-storm.component';

describe('SandStormComponent', () => {
  let component: SandStormComponent;
  let fixture: ComponentFixture<SandStormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SandStormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SandStormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
