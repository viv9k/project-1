import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalDisountPrice: number = 0
  totalActualPrice: number = 0
  couponCode: string = ""
  couponDiscountPercent: number
  totalDisountPricewithCoupon: number = 0
  constructor(public authService: AuthService, private router: Router, private backendService: BackendService) { }

  ngOnInit(): void {
    this.checkCart()
    this.backendService.readCouponData()
  }
  checkCart() {
    if (!this.authService.userData) {
      this.router.navigate(["Cart"]);
    }
    else {
      this.authService.userData.subscribe(data => {
        this.couponCode = data[0].CheckoutProductDetails.CouponCode;
        this.totalDisountPricewithCoupon = data[0].CheckoutProductDetails.TotalDisountPriceWithCouponApplied;
        this.couponDiscountPercent = data[0].CheckoutProductDetails.CouponDiscountPercentage;

        if (!data[0].Cart.length) {
          this.router.navigate(["Cart"]);
        }
        else {
          this.totalDisountPrice = 0
          this.totalActualPrice = 0
          data[0].Cart.map((item) => {
            this.totalDisountPrice += item.Product.DiscountPrice * item.Quantity
            this.totalActualPrice += item.Product.ActualPrice * item.Quantity
          });
        }
      });
    }
  }

}
