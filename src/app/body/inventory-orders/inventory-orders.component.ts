import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { Order } from 'src/app/Interface/OrderInterface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventory-orders',
  templateUrl: './inventory-orders.component.html',
  styleUrls: ['./inventory-orders.component.css']
})
export class InventoryOrdersComponent implements OnInit {

  constructor(
    public backendService: BackendService,
    public authService: AuthService,
    public router: Router,
    public functions: AngularFireFunctions,
    public toastService: ToastService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.backendService.readAdminOrderData();
  }
  openModal(content) {
    this.modalService.open(content, { size: 'xl', windowClass: 'dark-modal', scrollable: true });
  }
  closeModal() {
    this.modalService.dismissAll()
  }

  async updateOrder(order: Order) {
    const callable = this.functions.httpsCallable('order');
    try {
      const result = await callable({
        Mode: "UPDATE_ORDER", Id: order.Id,
        Status: order.Status,
      }).toPromise();
      this.toastService.show('Successfully Updated the Order', { classname: 'bg-warning text-dark' });
      console.log(result);
    } catch (error) {
    }
  }

  downloadShippingData(order: Order) {
    this.backendService.selectedOrder = order;
    this.router.navigate(["SelectedOrder"]);
  }
}
