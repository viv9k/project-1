import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from 'src/app/Interface/CouponInterface';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {

  couponCode: string
  couponValue: string
  couponDescription: string
  showCoupon: boolean

  constructor(
    public functions: AngularFireFunctions,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router,
    public backendService: BackendService,
  ) { }

  ngOnInit(): void {
    this.backendService.couponData.subscribe(data => {
      if (data.length === 0) {
        this.showCoupon = true
      }
      else {
        this.showCoupon = false
      }
    });
  }

  openModal(content) {
    this.modalService.open(content, { size: 'xl', windowClass: 'dark-modal', backdrop: "static", scrollable: true });
  }

  async createCoupon() {
    const callable = this.functions.httpsCallable('coupon');
    try {
      const result = await callable({
        Mode: "CREATE_COUPON",
        Code: this.couponCode,
        Value: this.couponValue,
        Description: this.couponDescription,
      }).toPromise();
      this.toastService.show('Successfully Added Coupon', { classname: 'bg-success text-light' });
      console.log(result);
      this.modalService.dismissAll()
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['Inventory']);
      });
    } catch (error) { }
  }
  async deleteCoupon(coupon: Coupon) {
    const callable = this.functions.httpsCallable('coupon');
    try {
      const result = await callable({
        Mode: "DELETE_COUPON",
        CouponId: coupon.Id,
      }).toPromise();
      this.toastService.show('Successfully Deleted Coupon', { classname: 'bg-danger text-light' });
      console.log(result);

    } catch (error) { }
  }
}
