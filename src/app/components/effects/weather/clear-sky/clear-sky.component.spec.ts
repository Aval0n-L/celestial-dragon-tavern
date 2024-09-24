import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearSkyComponent } from './clear-sky.component';

describe('ClearSkyComponent', () => {
  let component: ClearSkyComponent;
  let fixture: ComponentFixture<ClearSkyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearSkyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearSkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
