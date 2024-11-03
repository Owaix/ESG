import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() errortitle: string = '';

  get imageSrc(): string {
    return this.errortitle === 'success'
      ? '../../../../assets/images/success.png'
      : '../../../../assets/images/delete.png'; // Default image for error
  }

  get textColor(): string {
    return this.errortitle === 'success' ? 'green' : 'red'; // Color for success or error
  }
  closeModal() {
    this.close.emit();
  }
}
