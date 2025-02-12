import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModalCompanieComponent } from './create-modal-companie.component';

describe('CreateModalCompanieComponent', () => {
  let component: CreateModalCompanieComponent;
  let fixture: ComponentFixture<CreateModalCompanieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateModalCompanieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateModalCompanieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
