import { Component, OnInit, inject } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone:true,
  imports:[MatProgressSpinnerModule, CommonModule]
})
export class SpinnerComponent implements OnInit {
  showSpinner = false;
  spinnerService = inject(SpinnerService)

  constructor( ) { }

  ngOnInit(): void {
    this.spinnerService.spinnerState$.subscribe(state => {
      this.showSpinner = state;
    });
  }
}
