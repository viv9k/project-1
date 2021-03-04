import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  itemCollection: string
  constructor(private route: ActivatedRoute, public backendService: BackendService, public authService: AuthService) { }
  enableLoader: Boolean = true

  ngOnInit(): void {
    this.itemCollection = this.route.snapshot.params['collection'];
    if (this.itemCollection === "Products") {
      this.backendService.readProductData()
    }
    if (this.itemCollection === "Orders") {
      this.backendService.readOrderData()
    }
  }
}
