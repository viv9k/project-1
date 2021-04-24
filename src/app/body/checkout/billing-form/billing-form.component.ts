import { Component, NgZone, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
// import { sha512 } from 'js-sha512';


import { ICustomWindow, NativeWindowsService } from 'src/app/services/nativeWindow/native-windows-service.service';
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
    key: '',
    name: 'Customer name',
    description: 'Shopping',
    image: "https://vh-ecom.web.app/assets/logo.png",
    order_id: "",
    amount: 0,
    prefill: {
      name: '',
      contact: '',
      email: '', // add your email id
    },
    callback_url: "",
    notes: {},
    theme: {
      color: '#977552'
    },
    handler: (res) => {
      const paymentId = res.razorpay_payment_id;
      const orderId = res.razorpay_order_id;
      const signature = res.razorpay_signature;
      this.zone.run(() => {
        this.router.navigate(["OrderStatus", orderId, paymentId, signature]);
      })
    },
    modal: {
      ondismiss: (() => {
        this.zone.run(() => {
          // add current page routing if payment fails
          this.router.navigate(["OrderStatus", "f", "f", "f"]);
        })
      }),

    }
  };

  constructor(
    public functions: AngularFireFunctions,
    public authService: AuthService,
    private zone: NgZone,
    private winRef: NativeWindowsService,
    private router: Router
  ) {
    this._window = this.winRef.nativeWindow;
    this.options.prefill.name = authService.user.displayName;
    this.options.prefill.contact = authService.user.phoneNumber;
    this.options.prefill.email = authService.user.email;
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
        UserUid: this.authService.userUid,
      }).toPromise();
      console.log(result);
      this.options.order_id = result.id;
      this.options.amount = result.amount;
      this.options.key = result.key;
      this.options.callback_url = "http://localhost:4200/OrderStatus/" + result.id;
      this.initPay()
      // this.procceedToPayment(result);
    } catch (error) {
      console.log(error);
    }
  }
}
