import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})


export class SnackbarService {

  snackbar = inject(MatSnackBar)
  constructor() { }

  openSnackBar(message: string) {
    this.snackbar.open(message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 3000,
    });
  }

}
