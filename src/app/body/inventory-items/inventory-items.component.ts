import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage } from '@angular/fire/storage';
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
  constructor(
    public backendService: BackendService, public authService: AuthService,
    public router: Router, public functions: AngularFireFunctions, public toastService: ToastService,
    private storage: AngularFireStorage) { }
  enableLoader: Boolean = true
  newTag: string
  ngOnInit(): void {
    this.backendService.readProductData()
  }

  async modifyProduct(product: ProductId) {
    product.DiscountPrice = product.ActualPrice - (product.ActualPrice * product.DiscountPercent) / 100;
    if (this.newTag) {
      product.Tags.push(this.newTag.trim())
    }
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({
        Mode: "UPDATE", ProductId: product.Id, Name: product.Name, Description: product.Description,
        Availability: product.Availability, ActualPrice: product.ActualPrice, DiscountPrice: product.DiscountPrice,
        DiscountPercent: product.DiscountPercent, Visibility: product.Visibility,
        Sku: product.Sku, Stock: product.Stock, Tags: product.Tags
      }).toPromise();
      this.toastService.show('Successfully Updated the Product', { classname: 'bg-warning text-dark' });
      console.log(result);
    } catch (error) {
    }
  }

  async deleteProduct(product: ProductId) {
    const path = `ProductImages/${product.Id}`
    const ref = this.storage.ref(path);
    ref.listAll().toPromise().then(function (result) {
      result.items.forEach(function (file) {
        file.delete();
      });
    }).catch(function (error) {
      // Handle any errors
    });
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "DELETE", ProductId: product.Id }).toPromise();
      this.toastService.show('Successfully Deleted the Product', { classname: 'bg-danger text-light' });

      console.log(result);
    } catch (error) {
    }
  }
}
