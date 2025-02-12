import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  OnChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: Array<{ name: string; value: any }> = [];
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() required: boolean = false;
  @Input() control: FormControl = new FormControl('');
  @Input() isRow: boolean = false;
  @Input() isInvalid: boolean = false;
  @Input() placeholder: string = 'Selecione uma opção';

  isOpen: boolean = false;
  selectedValue: any = '';

  private onChange!: (value: any) => void;
  private onTouched!: () => void;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.selectedValue = option.value;
    this.onChange(option.value);
    this.onTouched();
    this.isOpen = false;
  }

  getSelectedOptionName(): string {
    const selectedOption = this.options.find(
      (option) => option.value === this.selectedValue
    );
    return selectedOption ? selectedOption.name : this.placeholder;
  }

  writeValue(value: any): void {
    this.selectedValue = value ? value : '';
    if (this.control) {
      this.control.setValue(this.selectedValue);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.control) {
      this.control.disable();
    }
  }
}
