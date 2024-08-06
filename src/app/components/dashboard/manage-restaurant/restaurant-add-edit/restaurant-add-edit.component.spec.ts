import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FirestoreService } from '../../../../services/firestore.service';
import { RestaurantAddEditComponent } from './restaurant-add-edit.component';

describe('RestaurantAddEditComponent', () => {
  let component: RestaurantAddEditComponent;
  let fixture: ComponentFixture<RestaurantAddEditComponent>;
  let firestoreServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    firestoreServiceMock = jasmine.createSpyObj('FirestoreService', ['getRestaurantById', 'updateData', 'addData', 'getDocByRef']);
    routerMock = { navigate: jasmine.createSpy('navigate') };
    activatedRouteMock = { queryParams: of({ id: '123' }) };

    await TestBed.configureTestingModule({
      declarations: [RestaurantAddEditComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule
      ],
      providers: [
        { provide: FirestoreService, useValue: firestoreServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.addressForm;
    expect(form).toBeTruthy();
    expect(form.get('name')?.value).toBeNull();
    expect(form.get('restaurantType')?.value).toBe('Veg only');
  });

  it('should validate form fields', () => {
    const form = component.addressForm;
    form.get('name')?.setValue(null);
    form.get('managerName')?.setValue(null);
    form.get('contact')?.setValue(null);
    form.get('city')?.setValue(null);
    form.get('state')?.setValue(null);
    form.get('postalCode')?.setValue(null);
    expect(form.valid).toBeFalsy();
  });




  it('should prevent non-numeric input in handleKey', () => {
    const event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    spyOn(event, 'preventDefault');
    component.handleKey(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
