import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './body/home/home.component';
import { InventoryItemsComponent } from './body/inventory-items/inventory-items.component';
import { InventoryComponent } from './body/inventory/inventory.component';
import { AngularFireAuthGuard, hasCustomClaim } from '@angular/fire/auth-guard';

const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "Inventory", component: InventoryComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly } },
  { path: "Inventory/Items", component: InventoryItemsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
