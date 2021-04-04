import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/Interface/CategoryInterface';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(
    public functions: AngularFireFunctions,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router,
    public backendService: BackendService,
  ) { }

  ngOnInit(): void {
    this.backendService.categoryData.subscribe(data => {
      if (!data.length) {
        this.showCategory = true
      }
      else {
        this.showCategory = false
      }
    });
  }

  categoryName: string
  categoryPosition: number
  showCategory: boolean = false

  openModal(content) {
    this.modalService.open(content, { size: 'xl', windowClass: 'dark-modal', backdrop: "static", scrollable: true });
  }

  toggleCategory() {
    this.showCategory = !this.showCategory
  }

  async createNewCategory() {
    const callable = this.functions.httpsCallable('category');
    try {
      const result = await callable({
        Mode: "ADD_CATEGORY",
        Name: this.categoryName,
        Position: this.categoryPosition,
      }).toPromise();
      this.toastService.show('Successfully Added Category', { classname: 'bg-success text-light' });
      console.log(result);
      this.modalService.dismissAll()
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['Inventory']);
      });
    } catch (error) { }
  }
  async modifyCategory(category: Category) {
    const callable = this.functions.httpsCallable('category');
    try {
      const result = await callable({
        Mode: "EDIT_CATEGORY",
        Id: category.Id,
        Name: category.Name,
        Position: category.Position,
      }).toPromise();
      this.toastService.show('Successfully Modified Category', { classname: 'bg-warning text-dark' });
      console.log(result);

    } catch (error) { }

  }
  async deleteCategory(category: Category) {
    const callable = this.functions.httpsCallable('category');
    try {
      const result = await callable({
        Mode: "DELETE_CATEGORY",
        Id: category.Id,
      }).toPromise();
      this.toastService.show('Successfully Deleted Category', { classname: 'bg-danger text-light' });
      console.log(result);

    } catch (error) { }
  }

}
