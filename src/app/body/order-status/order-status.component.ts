import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute, public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['orderId'];
    this.paymentId = this.route.snapshot.params['paymentId'];
    this.signature = this.route.snapshot.params['signature'];

    this.verifyOrderStatus();
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
      // this.procceedToPayment(result);
    } catch (error) {
      console.log(error);
     }
    this.status = "Success";
  }

}
