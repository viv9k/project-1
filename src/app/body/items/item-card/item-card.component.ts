import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { Order } from 'src/app/Interface/OrderInterface';
import { ProductId } from 'src/app/Interface/ProductInterface';
import { ToastService } from 'src/app/services/toast-service.service';
@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {

  @Input('product') product: ProductId
  @Input('order') order: Order

  public isCollapsed = true;

  constructor(public router: Router, public functions: AngularFireFunctions, public toastService: ToastService) { }

  ngOnInit(): void {
  }
  modifyProduct() {
    this.createNewProduct()
  }

  async createNewProduct() {
    const callable = this.functions.httpsCallable('createNewProduct');
    try {
      const result = await callable({ Mode: "Modify", ProductId: this.product.Id, Name: this.product.Name, Description: this.product.Description, Availability: this.product.Availability, ActualPrice: this.product.ActualPrice, DiscountPrice: this.product.DiscountPrice }).toPromise();
      this.toastService.show('Successfully Modified the Product', { classname: 'bg-success text-light' });

      console.log(result);
    } catch (error) {
    }
  }
}
