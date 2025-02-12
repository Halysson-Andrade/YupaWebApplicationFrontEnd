import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardCrudeComponent } from './standard-crude.component';

describe('StandardCrudeComponent', () => {
  let component: StandardCrudeComponent;
  let fixture: ComponentFixture<StandardCrudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardCrudeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardCrudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
