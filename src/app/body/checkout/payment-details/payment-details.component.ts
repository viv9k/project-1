import { Component, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

  isCollapsed2: boolean = false
  date: string
  constructor(
    public functions: AngularFireFunctions,
    public authService: AuthService,
  ) { }

  ngOnInit(): void { }

  @Input("totalDisountPrice") totalDisountPrice: number
  @Input("totalActualPrice") totalActualPrice: number

  async placeOrder() {
    const d = new Date();
    this.date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    const callable = this.functions.httpsCallable('order');
    try {
      const result = await callable({
        UserUid: this.authService.user.uid,
        TotalDisountPrice: this.totalDisountPrice,
        TotalActualPrice: this.totalActualPrice,
        Date: this.date,
        Mode: "PLACE_ORDER",
      }).toPromise();
      console.log(result);
    } catch (error) { }
  }
}
