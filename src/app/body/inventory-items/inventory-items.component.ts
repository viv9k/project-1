import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { ProductId } from 'src/app/Interface/ProductInterface';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
import { ToastService } from 'src/app/services/toast-service.service';


@Component({
  selector: 'app-inventory-items',
  templateUrl: './inventory-items.component.html',
  styleUrls: ['./inventory-items.component.css']
})
export class InventoryItemsComponent implements OnInit {

  itemCollection: string
  constructor(public backendService: BackendService, public authService: AuthService, public router: Router, public functions: AngularFireFunctions, public toastService: ToastService) { }
  enableLoader: Boolean = true

  ngOnInit(): void {
    this.backendService.readProductData()
  }

  modifyProduct(item: ProductId) {
    this.createNewProduct(item)
  }

  async createNewProduct(product: ProductId) {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "UPDATE", ProductId: product.Id, Name: product.Name, Description: product.Description, Availability: product.Availability, ActualPrice: product.ActualPrice, DiscountPrice: product.DiscountPrice, Visibility: product.Visibility }).toPromise();
      this.toastService.show('Successfully Updated the Product', { classname: 'bg-warning text-dark' });
      console.log(result);
    } catch (error) {
    }
  }

  async deleteProduct(product: ProductId) {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "DELETE", ProductId: product.Id }).toPromise();
      this.toastService.show('Successfully Deleted the Product', { classname: 'bg-danger text-light' });

      console.log(result);
    } catch (error) {
    }
  }
}
