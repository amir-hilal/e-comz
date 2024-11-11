import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top';
    config.panelClass = ['snackbar-success'];
    this.snackBar.open(message, 'Close', config);
  }

  showError(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top';
    config.panelClass = ['snackbar-error'];
    this.snackBar.open(message, 'Close', config);
  }
}
