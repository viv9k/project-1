import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/Interface/CategoryInterface';
import { Tag } from 'src/app/Interface/TagInterface';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProductComponent implements OnInit {

  @Input('productCount') productCount: number

  constructor(
    public functions: AngularFireFunctions,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router,
    public backendService: BackendService,
  ) { }

  enableLoader: boolean = false
  productImagesUploaded: boolean = false

  productName: string
  productDescription: string = ""
  productCategory: string
  productActualPrice: number
  productDiscountPrice: number
  productDiscountPercent: number
  productAvailability: string
  productVisibility: string
  productSku: string
  productStock: string
  productTag: string
  productDetails: { field: string, value: string }[] = []
  showCategoryWarning: boolean = false
  showTagWarning: boolean = false
  categories: Category[] = []
  tags: Tag[] = []

  ngOnInit(): void {
    for (let index = 0; index < 1; index++) {
      let obj = { field: "", value: "" };
      this.productDetails[index] = obj
    }
    this.backendService.categoryData.subscribe(data => {
      if (!data.length) {
        this.showCategoryWarning = true
      }
      else {
        this.categories = data
      }
    });
    this.backendService.tagData.subscribe(tagdata => {
      if (!tagdata.length) {
        this.showTagWarning = true
      }
      else {
        this.tags = tagdata
      }
    });
  }
  openModal(content) {
    if (this.showCategoryWarning) {
      return this.toastService.show('Add atleast 1 Category', { classname: 'bg-warning text-dark' });
    } if (this.showTagWarning) {
      return this.toastService.show('Add atleast 1 Tag', { classname: 'bg-warning text-dark' });
    }
    else {
      return this.modalService.open(content, { size: 'xl', windowClass: 'dark-modal', backdrop: "static", scrollable: true });
    }
  }

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
    console.log(this.files);
  }

  increaseFields() {
    let obj = { field: "", value: "" };
    this.productDetails[this.productDetails.length] = obj
  }

  async createNewProduct() {
    this.productDiscountPrice = this.productActualPrice - (this.productActualPrice * this.productDiscountPercent) / 100
    this.enableLoader = true;
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({
        Mode: "CREATE_PRODUCT", Name: this.productName, Description: this.productDescription,
        Availability: this.productAvailability, ActualPrice: this.productActualPrice,
        DiscountPrice: this.productDiscountPrice, DiscountPercent: this.productDiscountPercent,
        Visibility: this.productVisibility, Tag: this.productTag, Sku: this.productSku, Stock: this.productStock,
        Details: this.productDetails, Category: this.productCategory
      }).toPromise();
      this.toastService.show('Successfully Created the Product', { classname: 'bg-success text-light' });
      console.log(result);
      this.modalService.dismissAll()
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['Inventory']);
      });
      this.enableLoader = false;
    } catch (error) {
      this.enableLoader = false;
    }
  }

  deleteImageFromArray(data: { file: File }) {
    this.files = this.files.filter((file) => {
      return file.name != data.file.name
    })
  }

  confirm() {
    if (!this.files.length) {
      this.toastService.show('Please Add Product Images', { classname: 'bg-danger text-light' });
      return;
    }
    this.productImagesUploaded = true
  }
}