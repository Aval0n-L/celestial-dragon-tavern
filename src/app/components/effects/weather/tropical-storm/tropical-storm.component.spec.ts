import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TropicalStormComponent } from './tropical-storm.component';

describe('TropicalStormComponent', () => {
  let component: TropicalStormComponent;
  let fixture: ComponentFixture<TropicalStormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TropicalStormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TropicalStormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
