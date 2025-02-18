import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesslistComponent } from './processlist.component';

describe('ProcesslistComponent', () => {
  let component: ProcesslistComponent;
  let fixture: ComponentFixture<ProcesslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
