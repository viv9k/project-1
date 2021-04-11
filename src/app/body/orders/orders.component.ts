import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderLength: number = 0
  constructor(
    public backendService: BackendService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.backendService.readOrderData(this.authService.user.uid);
    if (this.backendService.orderData) {
      this.backendService.orderData.subscribe(data => {
        this.orderLength = data[0].TotalNumberOfProducts
      })
    }
  }
  navigateToOrderDetails(orderId: string) {
    this.router.navigate(["Orders", orderId]);
  }
}
