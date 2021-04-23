import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {

  status: string = ""
  orderId: string = ""
  paymentId: string = ""
  signature: string = ""
  date: string

  constructor(
    private route: ActivatedRoute,
    public functions: AngularFireFunctions,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['orderId'];
    this.paymentId = this.route.snapshot.params['paymentId'];
    this.signature = this.route.snapshot.params['signature'];
    if (this.paymentId !== "f") {
      this.verifyOrderStatus().then(() => {
        if (this.status === "Success") {
          this.placeOrder()
        }
      });
    }
  }

  async verifyOrderStatus() {
    const callable = this.functions.httpsCallable('paymentVerification');
    try {
      const result = await callable({
        OrderId: this.orderId,
        PaymentId: this.paymentId,
        Signature: this.signature,
      }).toPromise();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    this.status = "Success";
  }

  async placeOrder() {
    const d = new Date();
    this.date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    const callable = this.functions.httpsCallable('order');
    try {
      const result = await callable({
        UserUid: this.authService.user.uid,
        Date: this.date,
        Mode: "PLACE_ORDER",
      }).toPromise();
      console.log(result);
    } catch (error) { }
  }

}
