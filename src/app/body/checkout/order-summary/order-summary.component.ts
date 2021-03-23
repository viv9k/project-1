import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  isCollapsed: boolean = true
  cartLength: number = 0


  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkCartLength()
  }
  checkCartLength() {
    if (!this.authService.userData) {
      this.router.navigate(["Cart"]);
    }
    else {
      this.authService.userData.subscribe(data => {
        if (!data[0].Cart.length) {
          this.router.navigate(["Cart"]);
        }
        else {
          this.cartLength = data[0].Cart.length
        }
      }
      )
    }
  }

}
