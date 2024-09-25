import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtherealStormComponent } from './ethereal-storm.component';

describe('EtherealStormComponent', () => {
  let component: EtherealStormComponent;
  let fixture: ComponentFixture<EtherealStormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtherealStormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtherealStormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
