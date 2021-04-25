import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/Interface/OrderInterface';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-selected-order',
  templateUrl: './selected-order.component.html',
  styleUrls: ['./selected-order.component.css']
})
export class SelectedOrderComponent implements OnInit {

  order: Order;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.order = this.backendService.selectedOrder;
  }

}
