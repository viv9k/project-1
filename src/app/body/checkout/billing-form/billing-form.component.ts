import { Component, NgZone, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
// import { sha512 } from 'js-sha512';


import {ICustomWindow, NativeWindowsService} from 'src/app/services/nativeWindow/native-windows-service.service';
// import axios from "axios";

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
  infoPacket: any
  formData: any

  paymentStatus: string

  private _window: ICustomWindow;
  public rzp: any;

  public options: any = {
    key: 'rzp_test_bnt0m6RqSlXmhP', // add razorpay key here
    name: 'Customer name',
    description: 'Shopping',
    image: "http://localhost:4200/assets/logo.png",
    order_id: "",
    amount: 0,
    prefill: {
      name: 'Testing Account',
      contact: '8677965757',
      email: 'customeremail@gmail.com', // add your email id
    },
    callback_url: "",
    notes: {},
    theme: {
      color: '#977552'
    },
    handler: function (res){
      console.log(res);
      console.log(res.razorpay_payment_id);
      console.log(res.razorpay_order_id);
      console.log(res.razorpay_signature);
      // window.location.href = "http://localhost:4200/OrderStatus/"+res.razorpay_order_id+"/"+res.razorpay_payment_id+"/"+res.razorpay_signature;
    },
    modal: {
      ondismiss: (() => {
        this.zone.run(() => {
          // add current page routing if payment fails
        })
      }),

    }
  };

  constructor(
    public functions: AngularFireFunctions,
    public authService: AuthService,
    private zone: NgZone,
    private winRef: NativeWindowsService
  ) {
    this._window = this.winRef.nativeWindow;
  }

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
  // generateBase64String(string) {
  //   return sha512(string);
  // }

  async userBillingDetails(collapse: { toggle: () => void; }) {
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

  initPay(): void {
    this.rzp = new this.winRef.nativeWindow['Razorpay'](this.options);
    this.rzp.open();
  }

  async setOrderWithRazor() {
    const callable = this.functions.httpsCallable('payment');
    try {
      const result = await callable({
        Firstname: this.userName,
        Email: this.authService.user.email,
        Phone: this.mobileNumber,
        Amount: 100000.00,
      }).toPromise();
      console.log(result);
      this.options.order_id = result.id;
      this.options.amount = result.amount;
      this.options.callback_url = "http://localhost:4200/OrderStatus/" + result.id;
      this.initPay()
      // this.procceedToPayment(result);
    } catch (error) {
      console.log(error);
     }
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
