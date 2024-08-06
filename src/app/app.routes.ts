import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageRestaurantComponent } from './components/dashboard/manage-restaurant/manage-restaurant.component';
import { ManageMenuComponent } from './components/dashboard/manage-restaurant/manage-menu/manage-menu.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

export const routes: Routes = [

    {path:'restaurants/list', component:DashboardComponent},
    {path:'analytics', component:AnalyticsComponent},
    {path:'restaurants/add', component:ManageRestaurantComponent},
    {path:'restaurants/details', component:ManageRestaurantComponent},
    {path:'restaurants/menu/add', component:ManageMenuComponent},
    {path:'restaurants/menu/details', component:ManageMenuComponent},
    {path:'**', redirectTo:'restaurants/list'},
];
