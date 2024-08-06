import { Component, OnDestroy, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../../../services/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar.service';


@Component({
  selector: 'app-restaurant-add-edit',
  templateUrl: './restaurant-add-edit.component.html',
  styleUrl: './restaurant-add-edit.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ]
})
export class RestaurantAddEditComponent implements OnDestroy {
   fb = inject(FormBuilder);
   firestoreService = inject(FirestoreService);
   activatedRoute = inject(ActivatedRoute)
   snackbarService = inject(SnackbarService)
   router = inject(Router);
   observableRef : any;

  addressForm = this.fb.group({
    name: [null, Validators.required],
    managerName: [null, Validators.required],
    contact:[null, Validators.required],
    city: [null, Validators.required],
    state: [null, Validators.required],
    postalCode: [null, [Validators.required,Validators.minLength(6), Validators.maxLength(6)]],
    restaurantType: ['Veg only', Validators.required]
  });

  hasUnitNumber = false;

  states = [
    { name: 'Andhra Pradesh' },
    { name: 'Arunachal Pradesh' },
    { name: 'Assam' },
    { name: 'Bihar' },
    { name: 'Chhattisgarh' },
    { name: 'Goa' },
    { name: 'Gujarat' },
    { name: 'Haryana' },
    { name: 'Himachal Pradesh' },
    { name: 'Jharkhand' },
    { name: 'Karnataka' },
    { name: 'Kerala' },
    { name: 'Madhya Pradesh' },
    { name: 'Maharashtra' },
    { name: 'Manipur' },
    { name: 'Meghalaya' },
    { name: 'Mizoram' },
    { name: 'Nagaland' },
    { name: 'Odisha' },
    { name: 'Punjab' },
    { name: 'Rajasthan' },
    { name: 'Sikkim' },
    { name: 'Tamil Nadu' },
    { name: 'Telangana' },
    { name: 'Tripura' },
    { name: 'Uttar Pradesh' },
    { name: 'Uttarakhand' },
    { name: 'West Bengal' },
    { name: 'Andaman and Nicobar Islands' },
    { name: 'Chandigarh' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu' },
    { name: 'Lakshadweep' },
    { name: 'Delhi' },
    { name: 'Puducherry' },
    { name: 'Ladakh' },
    { name: 'Jammu and Kashmir' }
  ];
  restaurantId: any;
  

  constructor(){

      this.activatedRoute.queryParams.subscribe(params=>{
          this.restaurantId = params['id'];
          if(this.restaurantId){
            this.getRestaurantData(this.restaurantId);
          }
      })

      
  }

  getRestaurantData(restaurantId:any){
      this.firestoreService.getRestaurantById(restaurantId).then((res)=>{
        this.addressForm.patchValue(res.data());
      }).catch(err=>{
        this.snackbarService.openSnackBar("Unable to fetch restaurant data")
      })
  }

  onSubmit(): void {
    if(this.restaurantId){
      this.firestoreService.updateData(this.addressForm.value,'restaurants', this.restaurantId).then(res=>{
        this.snackbarService.openSnackBar("Restaurant data updated")
      }).catch(err=>{
        this.snackbarService.openSnackBar("Unable to update restaurant data")
      })
    }else{
      this.addNewRestaurant();
    }
  }

  addNewRestaurant(){
    // 1. add blank menu
    // 2. add menu ref to restaurant in menuId

    this.firestoreService.addData({menuItems:[]},'menus').then(docRef=> {
      let restaurantData = {...this.addressForm.value, menuId : docRef};
      this.firestoreService.addData(restaurantData,'restaurants').then((docRef)=>{
        this.observableRef = this.firestoreService.getDocByRef(docRef).subscribe({
        next : (res:any)=>{
        this.snackbarService.openSnackBar("New restaurant added")
        this.router.navigate(['/restaurants/details/'],{queryParams:{id:res.id}})
        },
        error : (err:any)=>{
        this.snackbarService.openSnackBar("Unable to add new restaurant")
        },
        complete : ()=>{

        }
        });
    });
    }).catch(err=>{
      console.log(err);
      this.snackbarService.openSnackBar("Unable to add new restaurant")

     
    })
  }

  handleKey(event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.observableRef?.unsubscribe();
  }
}
