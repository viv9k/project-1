import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './body/inventory/inventory.component';
import { ItemsComponent } from './body/items/items.component';
import { LoginComponent } from './body/login/login.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "Inventory", component: InventoryComponent },
  { path: "Inventory/:collection", component: ItemsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
