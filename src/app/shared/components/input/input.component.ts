import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() required: boolean = false;
  @Input() control: FormControl = new FormControl();
  @Input() isRow: boolean = false;
  @Input() isInvalid: boolean = false;

  checked: boolean = false;

  toggleCheckbox(): void {
    this.checked = !this.checked;
    this.control.setValue(this.checked);
  }
}
