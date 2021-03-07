import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProductId } from 'src/app/Interface/ProductInterface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast-service.service';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProductComponent implements OnInit {

  @Input('product') product: ProductId

  constructor(public functions: AngularFireFunctions,
    private fireStorage: AngularFireStorage, private modalService: NgbModal, public toastService: ToastService) { }

  ngOnInit(): void { }

  enableLoader: boolean = false
  productImageUploaded: boolean = false

  productImage: File = null;
  productName: string
  productDescription: string = ""
  productImageURL: string
  productActualPrice: number
  productDiscountPrice: number
  productAvailability: string
  productVisibility: string

  openModal(content) {
    this.modalService.open(content, { size: 'xl', windowClass: 'dark-modal' });
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.productImage = (target.files)[0];
    const filePath = `ProductLogos/${this.productImage.name}`;
    const task = this.fireStorage.upload(filePath, this.productImage);
  }

  uploadLogo() {
    this.fireStorage.ref(`ProductLogos/${this.productImage.name}`).getDownloadURL().subscribe(data => {
      this.productImageURL = data
      this.productImageUploaded = true
    });
  }

  async submit() {
    this.createNewProduct()
  }

  async createNewProduct() {
    this.enableLoader = true;
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "CREATE", Name: this.productName, Description: this.productDescription, ImageURL: this.productImageURL, Availability: this.productAvailability, ActualPrice: this.productActualPrice, DiscountPrice: this.productDiscountPrice, Visibility: this.productVisibility }).toPromise();
      this.toastService.show('Successfully Created the Product', { classname: 'bg-success text-light' });
      console.log(result);
      this.modalService.dismissAll()
      this.enableLoader = false;
    } catch (error) {
      this.enableLoader = false;
    }
  }
}