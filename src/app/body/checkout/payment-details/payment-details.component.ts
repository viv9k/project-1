import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

  isCollapsed2: boolean = false

  constructor(
    public functions: AngularFireFunctions,
    public authService: AuthService,
    private httpClient: HttpClient) { }

  ngOnInit(): void { }

  async placeOrder() {
    const callable = this.functions.httpsCallable('checkout');
    try {
      const result = await callable({
        UserUid: this.authService.userUid,
        Mode: "PLACE_ORDER",
      }).toPromise();
      console.log(result);
    } catch (error) { }
  }
}
