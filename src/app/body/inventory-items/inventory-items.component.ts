import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Category } from 'src/app/Interface/CategoryInterface';
import { ProductId } from 'src/app/Interface/ProductInterface';
import { Tag } from 'src/app/Interface/TagInterface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service'

@Component({
  selector: 'app-inventory-items',
  templateUrl: './inventory-items.component.html',
  styleUrls: ['./inventory-items.component.css']
})
export class InventoryItemsComponent implements OnInit {

  itemCollection: string
  enableLoader: Boolean = true
  newField: string
  newValue: string

  constructor(
    public backendService: BackendService,
    public authService: AuthService,
    public router: Router,
    public functions: AngularFireFunctions,
    public toastService: ToastService,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.backendService.readProductData()
  }

  async modifyProduct(product: ProductId) {
    product.DiscountPrice = product.ActualPrice - (product.ActualPrice * product.DiscountPercent) / 100;
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({
        Mode: "UPDATE_PRODUCT", ProductId: product.Id, Name: product.Name, Description: product.Description,
        Availability: product.Availability, ActualPrice: product.ActualPrice, DiscountPrice: product.DiscountPrice,
        DiscountPercent: product.DiscountPercent, Visibility: product.Visibility,
        Sku: product.Sku, Stock: product.Stock, Category: product.Category, Tag: product.Tag,
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
      const result = await callable({ Mode: "DELETE_PRODUCT", ProductId: product.Id }).toPromise();
      this.toastService.show('Successfully Deleted the Product', { classname: 'bg-danger text-light' });
      console.log(result);
    } catch (error) {
    }
  }

  async onAddNewDetailsField(product: ProductId) {
    const newObject = { field: this.newField, value: this.newValue }
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "ADD_FIELD", ProductId: product.Id, NewObject: newObject }).toPromise();
      this.toastService.show('Successfully Added New Field', { classname: 'bg-success text-light' });
    }
    catch (error) {

    }
    this.newField = ""
    this.newValue = ""
  }
  async onDeleteDetailsField(product: ProductId, index: number) {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "DELETE_FIELD", ProductId: product.Id, ObjectIndex: index }).toPromise();
      this.toastService.show('Successfully Deleted Field & Value', { classname: 'bg-success text-light' });
    }
    catch (error) {

    }
  }
  async onSetCategory(product: ProductId, category: Category) {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({
        Mode: "UPDATE_PRODUCT_CATEGORY", ProductId: product.Id, Category: category.Name
      }).toPromise();
      this.toastService.show('Successfully Updated the Product Category', { classname: 'bg-warning text-dark' });
      console.log(result);
    } catch (error) {
    }
  }
  async onSetTag(product: ProductId, tag: Tag) {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({
        Mode: "UPDATE_PRODUCT_TAG", ProductId: product.Id, Tag: tag.Name,
      }).toPromise();
      this.toastService.show('Successfully Updated the Product Tag', { classname: 'bg-warning text-dark' });
      console.log(result);
    } catch (error) {
    }
  }
}
