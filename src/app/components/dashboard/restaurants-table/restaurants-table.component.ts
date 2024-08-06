import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirestoreService } from '../../../services/firestore.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerService } from '../../../services/spinner.service';
import { SpinnerComponent } from '../../../services/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface RestaurantData {
  name: string;
  managerName: string;
  restaurantType: string;
  city: string;
  contact: string;
}

/** Constants used to fill up our data base. */
const cityS: string[] = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'];
const NAMES: string[] = [
  'Burger Barn',
  'Healthy Foods',
  'Fresh Menu',
  'Quick Bites',
];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-restaurants-table',
  templateUrl: './restaurants-table.component.html',
  styleUrl: './restaurants-table.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    SpinnerComponent,
    MatProgressSpinnerModule
  ],
})
export class RestaurantsTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'managerName', 'contact', 'restaurantType', 'city'];
  dataSource!: MatTableDataSource<RestaurantData>;
  firestoreService = inject(FirestoreService);
  router = inject(Router);
  spinnerService = inject(SpinnerService)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    const dummy = Array.from({ length: 0 }, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(dummy);
   
  }

  ngOnInit(): void {
    this.getRestaurantData();
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRestaurantData() {
    this.spinnerService.showSpinner()
   const getDataObsRef = this.firestoreService.getDataFor('restaurants').subscribe({
      next: (res: any) => {
        this.spinnerService.hideSpinner()
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.name.toLowerCase().includes(filter) || 
          data.restaurantType.toLowerCase().includes(filter) ||
          data.city.toLowerCase().includes(filter) ||
          data.managerName.toLowerCase().includes(filter) ||
          data.contact.toLowerCase().includes(filter) 
          };

        this.getMenu(res[0].menuId)        

      },
      error: (err: any) => {
        this.spinnerService.hideSpinner()

      },
      complete: () => {
        this.spinnerService.hideSpinner()
        getDataObsRef.unsubscribe();
      },
    });
  }

  getMenu(menuRef:any){
    this.firestoreService.getMenuById(menuRef).then((res)=>{
      console.log(res.data());
      
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  goToRestaurant(row:any){
    console.log(row);
    this.router.navigate(['/restaurants/details/'],{queryParams:{id:row.id}})
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): RestaurantData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))];
  return {
    name: name,
    managerName: name,
    city: cityS[Math.round(Math.random() * (cityS.length - 1))],
    restaurantType: 'Veg only',
    contact: "0000000010"

  };
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
