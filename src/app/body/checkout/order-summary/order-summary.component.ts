import { Component, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  @Input("totalDisountPrice") totalDisountPrice: number
  @Input("totalActualPrice") totalActualPrice: number

  isCollapsed: boolean = true
  cartLength: number = 0

  constructor(
    public authService: AuthService,
    private router: Router,
    public functions: AngularFireFunctions,
  ) { }

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
