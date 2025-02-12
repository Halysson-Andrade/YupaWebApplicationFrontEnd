import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustonUsersModalComponent } from './custon-users-modal.component';

describe('CustonUsersModalComponent', () => {
  let component: CustonUsersModalComponent;
  let fixture: ComponentFixture<CustonUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustonUsersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustonUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
