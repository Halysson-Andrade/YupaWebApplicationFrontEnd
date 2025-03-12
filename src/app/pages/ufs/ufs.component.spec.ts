import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UfsComponent } from './ufs.component';

describe('UfsComponent', () => {
  let component: UfsComponent;
  let fixture: ComponentFixture<UfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UfsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
