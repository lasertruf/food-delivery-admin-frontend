import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RestaurantsTableComponent } from './restaurants-table/restaurants-table.component';
import { BreakpointService } from '../../services/breakpoint.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RestaurantsTableComponent,
    RouterModule
  ]
})
export class DashboardComponent {



   breakpointService = inject(BreakpointService);
   isHandset$ !: Observable<any>;
  constructor(){

  this.isHandset$ = this.breakpointService.isHandset$;

  }


}
