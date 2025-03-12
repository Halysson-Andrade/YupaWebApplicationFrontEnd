import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UfModalComponent } from './uf-modal.component';

describe('UfModalComponent', () => {
  let component: UfModalComponent;
  let fixture: ComponentFixture<UfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UfModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
