import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/Interface/CategoryInterface';
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
  ngOnInit(): void {
    for (let index = 0; index < 1; index++) {
      let obj = { field: "", value: "" };
      this.productDetails[index] = obj
    }
    this.backendService.categoryData.subscribe(data => {
      if (!data.length) {
        this.showWarning = true
      }
      else {
        this.categories = data
      }
    })
  }

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
  productTags: string
  productDetails: { field: string, value: string }[] = []
  showWarning: boolean = false
  categories: Category[] = []

  openModal(content) {
    if (this.showWarning) {
      return this.toastService.show('Add atleast 1 Category', { classname: 'bg-warning text-dark' });
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
    let productTagsArray = []
    this.productTags.split(",").map(tag => {
      productTagsArray.push(tag.trim())
    })

    this.enableLoader = true;
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({
        Mode: "CREATE_PRODUCT", Name: this.productName, Description: this.productDescription,
        Availability: this.productAvailability, ActualPrice: this.productActualPrice,
        DiscountPrice: this.productDiscountPrice, DiscountPercent: this.productDiscountPercent,
        Visibility: this.productVisibility, Tags: productTagsArray, Sku: this.productSku, Stock: this.productStock,
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