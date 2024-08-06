import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinnerState$ = this.spinnerSubject.asObservable();

  showSpinner(): void {
    this.spinnerSubject.next(true);
  }

  hideSpinner(): void {
    this.spinnerSubject.next(false);
  }
}
