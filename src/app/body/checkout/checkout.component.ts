import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalDisountPrice: number = 0
  totalActualPrice: number = 0

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkCart()
  }
  checkCart() {
    if (!this.authService.userData) {
      this.router.navigate(["Cart"]);
    }
    else {
      this.authService.userData.subscribe(data => {
        if (!data[0].Cart.length) {
          this.router.navigate(["Cart"]);
        }
        else {
          this.totalDisountPrice = 0
          this.totalActualPrice = 0
          data[0].Cart.map((item) => {
            this.totalDisountPrice += item.Product.DiscountPrice * item.Quantity
            this.totalActualPrice += item.Product.ActualPrice * item.Quantity
          })
        }
      })
    }
  }

}
