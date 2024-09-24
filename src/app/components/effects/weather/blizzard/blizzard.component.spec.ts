import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlizzardComponent } from './blizzard.component';

describe('BlizzardComponent', () => {
  let component: BlizzardComponent;
  let fixture: ComponentFixture<BlizzardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlizzardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlizzardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
