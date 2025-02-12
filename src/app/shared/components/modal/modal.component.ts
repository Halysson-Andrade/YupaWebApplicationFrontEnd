import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() modalType: 'new' | 'edit' = 'new';
  @Input() modalTitle: string = '';
  @Input() modalData: any;

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmAction = new EventEmitter<any>();

  onClose(): void {
    this.closeModal.emit();
  }

  onConfirm(): void {
    this.confirmAction.emit(this.modalData);
  }
}
