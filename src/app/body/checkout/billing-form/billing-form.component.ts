import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.css']
})
export class BillingFormComponent implements OnInit {

  isCollapsed1: boolean = false

  userName: string
  mobileNumber: number
  pincode: number
  address: string
  city: string
  state: string
  country: string = "India"

  constructor(
    public functions: AngularFireFunctions,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.userData.subscribe(data => {
      this.userName = data[0].BillingDetails.UserName
      this.mobileNumber = data[0].BillingDetails.MobileNumber
      this.pincode = data[0].BillingDetails.Pincode
      this.address = data[0].BillingDetails.Address
      this.city = data[0].BillingDetails.City
      this.state = data[0].BillingDetails.State
      this.country = data[0].BillingDetails.Country
    })
  }

  async userBillingDetails(collapse) {
    collapse.toggle()
    const callable = this.functions.httpsCallable('checkout');
    try {
      const result = await callable({
        UserUid: this.authService.userUid,
        Mode: "UPDATE_BILLING_DETAILS",
        UserName: this.userName,
        MobileNumber: this.mobileNumber,
        Pincode: this.pincode,
        Address: this.address,
        City: this.city,
        State: this.state,
        Country: this.country,
      }).toPromise();
      console.log(result);
    } catch (error) { }
  }
}
