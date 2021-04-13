import { Component, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { sha512 } from 'js-sha512';
import { HttpClient } from '@angular/common/http';
import axios from "axios";

@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.css']
})
export class BillingFormComponent implements OnInit {

  @Input("totalDisountPrice") totalDisountPrice: number
  @Input("totalActualPrice") totalActualPrice: number

  isCollapsed1: boolean = false
  isCollapsed2: boolean = false

  userName: string
  mobileNumber: number
  pincode: number
  address: string
  city: string
  state: string
  country: string = "India"

  date: string

  constructor(
    public functions: AngularFireFunctions,
    public authService: AuthService,
    private builder: FormBuilder,
    private httpClient: HttpClient
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
  generateBase64String(string) {
    return sha512(string);
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
  async getPayuURL() {
    // const key = "kJGZUj";
    // const salt = "rUbUQwix";
    // const mode = "TEST";
    // const date = new Date();
    // const TransactionId = this.generateBase64String(date.getMilliseconds().toString() + date + "Sandeep");

    // const userData = {
    //   firstname: "Sandeep",
    //   email: "valpasanisan@gmail.com",
    //   phone: 7013344123,
    //   amount: 100.00,
    //   productinfo: "test",
    //   txnid: TransactionId, //generate unique transaction Id at server side
    //   surl: "http://localhost:4200/Payment/Success",
    //   furl: "http://localhost:4200/Payment/Failure",
    // };

    // let payUmoneyURL;
    // let redirectURL;
    // const hashData = {
    //   // hashSequence: key + '|' + data.TransactionId + '|' + data.Amount + '|' + data.Productinfo + '|' + data.Firstname + '|' + data.Email + '|||||||||||' + salt,
    //   hashSequence: key + '|' + "121221211221dssdfddg" + '|' + "100.00" + '|' + "Test" + '|' + "Sandeep" + '|' + "valpasanisan@gmail.com" + '|||||||||||' + salt,
    // };
    // const hash = sha512(hashData.hashSequence);

    // const payuData = {
    //   key: key,
    //   salt: salt,
    //   service_provider: 'payu_paisa',
    //   hash: hash,
    // };

    // const params = Object.assign(payuData, userData);
    // if (mode === "TEST") {
    //   payUmoneyURL = 'https://test.payu.in/_payment';
    // }
    // let options = {
    //   headers: {
    //     'NoAuth': 'True',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    //     'Access-Control-Allow-Headers': 'X-Requested-With,content-type,',
    //     'Access-Control-Allow-Credentials': 'true',
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "accept": "application/json"
    //   }
    // };
    // axios.post(payUmoneyURL, params, options).then(res => {
    //   console.log(res);
    // }).catch(err => {
    //   console.log(err);
    // });

    const callable = this.functions.httpsCallable('payment');
    try {
      const result = await callable({
        Firstname: this.userName,
        Email: this.authService.user.email,
        Phone: this.mobileNumber,
        Amount: this.totalDisountPrice.toFixed(1),
        Productinfo: "Test",
      }).toPromise();
      console.log(result);
    } catch (error) { }
  }

  async placeOrder() {
    const d = new Date();
    this.date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    const callable = this.functions.httpsCallable('order');
    try {
      const result = await callable({
        UserUid: this.authService.user.uid,
        // TotalDisountPrice: this.totalDisountPrice,
        // TotalActualPrice: this.totalActualPrice,
        Date: this.date,
        Mode: "PLACE_ORDER",
      }).toPromise();
      console.log(result);
    } catch (error) { }
  }
}
