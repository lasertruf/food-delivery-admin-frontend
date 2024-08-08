import { Component, ViewChild, inject } from '@angular/core';
import { FirestoreService } from '../../../../services/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  FormBuilder,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LogoComponent } from '../../../../shared/logo/logo.component';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-manage-menu',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TitleCasePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    LogoComponent,
  ],
  providers: [TitleCasePipe],
  templateUrl: './manage-menu.component.html',
  styleUrl: './manage-menu.component.scss',
})
export class ManageMenuComponent {
  @ViewChild('formDirective') private formDirective!: NgForm;

  firestoreService = inject(FirestoreService);
  activatedRoute = inject(ActivatedRoute);
  snackbarService = inject(SnackbarService)

  router = inject(Router);
  restaurantId: any;
  restaurantData: any;
  fb = inject(FormBuilder);
  menuForm = this.fb.group({
    dishName: ['', Validators.required],
    dishPrice: ['', Validators.required],
  });

  menuFormInline = this.fb.group({
    dishName: ['', Validators.required],
    dishPrice: ['', Validators.required],
  });


  menuItems: any[] = [];


  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.restaurantId = params['id'];
      if (this.restaurantId) {
        this.getRestaurantData(this.restaurantId);
      }
    });
  }

  getRestaurantData(restaurantId: any) {
    this.firestoreService.getRestaurantById(restaurantId).then((res) => {
      this.restaurantData = res.data();
      this.getMenuItems();
    });
  }

  goToDetails() {
    this.router.navigate(['/restaurants/details'], {
      queryParams: { id: this.restaurantId },
    });
  }

  getMenuItems() {
    this.firestoreService.getDocByRef(this.restaurantData.menuId).subscribe({
      next: (res: any) => {
        res.menuItems.map((el: any) => {
          return { ...el, isEditMode: false };
        });
        this.menuItems = res.menuItems;
        console.log(this.menuItems);
      },
      error: (err: any) => {},
      complete: () => {},
    });
  }

  onAddDish() {
    let data = this.menuItems.map(({ isEditMode, ...rest }) => rest);

    let menuData = {
      menuItems: [...data, this.menuForm.value],
    };

    this.firestoreService
      .updateDataByRef(menuData, this.restaurantData.menuId)
      .then((res) => {
        this.menuForm.reset();
        this.formDirective.resetForm();
        this.snackbarService.openSnackBar("New dish added to the menu.")
      });
  }

  onDelete(index: any) {
    this.menuItems.splice(index, 1);
    this.updateDb(this.menuItems);
  }

  updateDb(data: any[]) {
    data = data.map(({ isEditMode, ...rest }) => rest);

    let menuData = {
      menuItems: [...data],
    };

    this.firestoreService
      .updateDataByRef(menuData, this.restaurantData.menuId)
      .then((res) => {
        console.log(res);
        this.snackbarService.openSnackBar("Menu updated")
      })
      .catch((err) => {
        this.snackbarService.openSnackBar("Error in updating the menu")
      });
  }

  handleKey(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onEdit(index: number) {
    this.menuItems.forEach((element) => {
      element.isEditMode = false;
    });

    this.menuItems[index].isEditMode = true;
    this.menuFormInline.patchValue({
      dishName: this.menuItems[index].dishName,
      dishPrice: this.menuItems[index].dishPrice,
    });
  }

  saveEdit(index: number) {
    if (this.menuFormInline.valid) {
      this.menuItems[index].dishName = this.menuFormInline.value.dishName;
      this.menuItems[index].dishPrice = this.menuFormInline.value.dishPrice;
      this.menuItems[index].isEditMode = false;

      this.updateDb(this.menuItems);
    }
  }

  onCancel() {
    this.menuForm.reset();
    setTimeout(() => {
      this.formDirective.resetForm();
    }, 0);
  }
}
