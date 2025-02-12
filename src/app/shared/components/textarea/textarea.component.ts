import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextAreaComponent {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() rows: number = 3;
  @Input() maxlength: number = 200;
  @Input() required: boolean = false;
  @Input() control: FormControl = new FormControl();
  @Input() isRow: boolean = false;
  @Input() isInvalid: boolean = false;
  @Input() placeholder: string = '';

  get remainingChars(): number {
    return this.maxlength - (this.control.value?.length || 0);
  }
}
