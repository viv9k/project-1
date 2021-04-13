import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './body/home/home.component';
import { InventoryItemsComponent } from './body/inventory-items/inventory-items.component';
import { InventoryComponent } from './body/inventory/inventory.component';
import { AngularFireAuthGuard, hasCustomClaim } from '@angular/fire/auth-guard';
import { ProductDetailsComponent } from './body/product-details/product-details.component';
import { CartComponent } from './body/cart/cart.component';
import { CheckoutComponent } from './body/checkout/checkout.component';
import { OrdersComponent } from './body/orders/orders.component';
import { OrderDetailsComponent } from './body/order-details/order-details.component';
import { InventoryOrdersComponent } from './body/inventory-orders/inventory-orders.component';
import { SpecificCategoryComponent } from './body/specific-category/specific-category.component';

const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  { path: "", component: HomeComponent },
  // { path: "Inventory", component: InventoryComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly } },
  // { path: "Inventory/Items", component: InventoryItemsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly } },
  // { path: "Inventory/Orders", component: InventoryOrdersComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly } },
  { path: "Inventory", component: InventoryComponent, canActivate: [AngularFireAuthGuard] }, // Remove in main deployment
  { path: "Inventory/Items", component: InventoryItemsComponent, canActivate: [AngularFireAuthGuard] },// Remove in main deployment
  { path: "Inventory/Orders", component: InventoryOrdersComponent, canActivate: [AngularFireAuthGuard] },// Remove in main deployment
  { path: "Products/:productId", component: ProductDetailsComponent },
  { path: "Cart", component: CartComponent },
  { path: "Cart/Checkout", component: CheckoutComponent },
  { path: "Orders", component: OrdersComponent },
  { path: "Orders/:orderId", component: OrderDetailsComponent },
  { path: "Category/:categoryName", component: SpecificCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
