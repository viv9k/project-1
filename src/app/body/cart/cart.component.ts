import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  showProceedMenu: boolean = false
  totalDisountPrice: number = 0
  totalActualPrice: number = 0
  cartLength: number = 0
  constructor(
    public backendService: BackendService,
    public authService: AuthService,
    private functions: AngularFireFunctions,
    private router: Router) { }

  ngOnInit(): void {
    this.calculateTotalPrice()
    if (this.authService.userData) {
      this.authService.userData.subscribe(data => {
        this.cartLength = data[0].Cart.length;
      })
    }
  }
  navigateToCheckout() {
    this.router.navigate(["Cart/Checkout"]);
  }
  async incrementQuantity(quantity: number, cartIndex: number, uid: string) {
    const callable = this.functions.httpsCallable('cart');
    try {
      await callable({ Mode: "UPDATE_QUANTITY", Quantity: quantity + 1, Index: cartIndex, UserUid: uid }).toPromise().then(() => {
        this.calculateTotalPrice()
      });
    } catch (error) {
    }
  }
  async decrementQuantity(quantity: number, cartIndex: number, uid: string) {
    quantity <= 1 ? quantity = 1 : quantity = quantity - 1;
    const callable = this.functions.httpsCallable('cart');
    try {
      const result = await callable({ Mode: "UPDATE_QUANTITY", Quantity: quantity, Index: cartIndex, UserUid: uid }).toPromise().then(() => {
        this.calculateTotalPrice()
      });
    } catch (error) {
    }
    this.calculateTotalPrice()
  }

  async removeItemFromCart(cartIndex: number, uid: string) {
    const callable = this.functions.httpsCallable('cart');
    try {
      const result = await callable({ Mode: "DELETE_PRODUCT_FROM_CART", Index: cartIndex, UserUid: uid }).toPromise();
    } catch (error) {
    }
    this.calculateTotalPrice()
  }
  calculateTotalPrice() {
    if (!this.authService.userData) {
      return;
    }
    else {
      this.authService.userData.subscribe(data => {
        this.totalDisountPrice = 0
        this.totalActualPrice = 0
        if (!data[0].Cart.length) {
          this.showProceedMenu = false
        }
        else {
          this.showProceedMenu = true
          data[0].Cart.map((item) => {
            this.totalDisountPrice += item.Product.DiscountPrice * item.Quantity
            this.totalActualPrice += item.Product.ActualPrice * item.Quantity
          })
        }
      })
    }

  }
}
