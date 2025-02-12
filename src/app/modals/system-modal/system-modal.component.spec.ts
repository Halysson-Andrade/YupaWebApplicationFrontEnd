import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemModalComponent } from './system-modal.component';

describe('SystemModalComponent', () => {
  let component: SystemModalComponent;
  let fixture: ComponentFixture<SystemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
