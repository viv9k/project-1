import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-specific-category',
  templateUrl: './specific-category.component.html',
  styleUrls: ['./specific-category.component.css']
})
export class SpecificCategoryComponent implements OnInit {

  categoryName: string
  constructor(public backendService: BackendService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.categoryName = this.route.snapshot.params["categoryName"]
  }

}
