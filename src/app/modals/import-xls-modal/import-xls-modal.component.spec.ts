import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportXlsModalComponent } from './import-xls-modal.component';

describe('ImportXlsModalComponent', () => {
  let component: ImportXlsModalComponent;
  let fixture: ComponentFixture<ImportXlsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportXlsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportXlsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
