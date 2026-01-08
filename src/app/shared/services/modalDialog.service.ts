import { computed, Injectable, signal, Type } from '@angular/core';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ModalDialogService {
  private _isOpen = signal(false);
  private _type = signal<ModalType>('success');;
  private _title = signal('');
  private _message = signal('');

  readonly isOpen = computed(() => this._isOpen());
  readonly type = computed(() => this._type());
  readonly title = computed(() => this._title());
  readonly message = computed(() => this._message());

  open(type: ModalType, title: string, message: string) {
    this._type.set(type);
    this._title.set(title);
    this._message.set(message);
    this._isOpen.set(true);
  }

  showSuccess(title: string, message?: string) {
    this.open('success', title, message || '');
  }

  showError(title: string, message?: string) {
    this.open('error', title, message || '');
  }

  showInfo(title: string, message?: string) {
    this.open('info', title, message || '');
  }

  close() {
    this._isOpen.set(false);
  }
}
