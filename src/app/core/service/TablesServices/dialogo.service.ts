import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  confirm(
    title: string,
    message: string,
    okText = 'OK',
    cancelText = 'Cancelar'
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const result = window.confirm(`${title}\n\n${message}`);
      resolve(result);
    });
  }
}
