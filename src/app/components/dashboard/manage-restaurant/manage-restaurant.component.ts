import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { RestaurantAddEditComponent } from './restaurant-add-edit/restaurant-add-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-manage-restaurant',
  standalone: true,
  imports: [
    RestaurantAddEditComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './manage-restaurant.component.html',
  styleUrl: './manage-restaurant.component.scss',
})
export class ManageRestaurantComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  firestoreService = inject(FirestoreService);
  snackbarService = inject(SnackbarService);
  componentType: string = '';
  pageTitle: string = '';
  restaurantId: any = '';
  snackBar = inject(MatSnackBar);
  restaurantData : any;

  constructor() {
    let url = this.activatedRoute.snapshot.routeConfig?.path;

    this.activatedRoute.queryParams.subscribe((params) => {
      this.restaurantId = params['id'];

      if(this.restaurantId){
        this.getRestaurantData(this.restaurantId);
      }
    });
    console.log(url, this.restaurantId);

    if (url?.startsWith('restaurants/add')) {
      this.componentType = 'add';
      this.pageTitle = 'Add new restaurant';
    } else {
      this.componentType = 'details';
      this.pageTitle = 'Restaurant details';
    }
  }

  getRestaurantData(id: string) {
    this.firestoreService.getRestaurantById(id).then((res) => {
      this.restaurantData = res.data();
    }).catch(err=>{
      this.snackBar.open("Unable to fetch restaurants");
    });
  }

  deleteRestaurant() {
    this.firestoreService
      .deleteDocById(this.restaurantId, 'restaurants')
      .then((res) => {
        this.snackbarService.openSnackBar('Restaurant deleted.');
        this.router.navigate(['restaurants/list']);
      }).catch(err=>{
        this.snackBar.open("Unable to delete restaurant");
      });
  }

  onDelete(){
    // 1. delete menu
    // 2. delete restaurant

    this.firestoreService
      .deleteDocByRef(this.restaurantData.menuId)
      .then((res) => {
        this.deleteRestaurant()
      }).catch(err=>{
        this.snackBar.open("Unable to delete restaurant");
      });
  }

  onMenuClick() {
    if (this.restaurantId) {
      this.router.navigate(['restaurants/menu/details'], {queryParams:{id:this.restaurantId}});
    } else {
      this.router.navigate(['restaurants/menu/add']);
    }
  }

 
}
