import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { combineAll } from 'rxjs/operators';
import { Image } from 'src/app/Interface/ImageInterface';
import { ProductId } from 'src/app/Interface/ProductInterface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productId: string
  selectedImage: string
  productQuantity: number = 1
  productData: ProductId
  loader: boolean = false

  @ViewChild('imageContainer', { read: ElementRef }) public imageContainer: ElementRef<any>;

  constructor(private route: ActivatedRoute,
    public backendService: BackendService,
    private toastService: ToastService,
    private functions: AngularFireFunctions,
    private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['productId'];
    this.backendService.readProductData();
    this.backendService.productData.subscribe(data => {
      data.map(product => {
        if (product.Id === this.productId) {
          this.selectedImage = product.Images[0].DownloadURL
        }
      })
    });
    if (this.authService.userData) {
      this.authService.userData.subscribe(data => {
        data[0].Cart.map(item => {
          if (item.Product.Id === this.productId) {
            this.productQuantity = item.Quantity
          }
        })
      })
    }
  }

  showSelectedImage(image: Image) {
    this.selectedImage = image.DownloadURL
  }

  scrollLeft() {
    this.imageContainer.nativeElement.scrollTo({ left: (this.imageContainer.nativeElement.scrollLeft - 200), block: "start", inline: "nearest" });
  }

  scrollRight() {
    this.imageContainer.nativeElement.scrollTo({ left: (this.imageContainer.nativeElement.scrollLeft + 200), block: "start", inline: "nearest" });
  }
  incrementQuantity() {
    this.productQuantity += 1
  }
  decrementQuantity() {
    if (this.productQuantity <= 1) {
      this.productQuantity = 1
    }
    else {
      this.productQuantity -= 1
    }

  }
  async addToCart() {
    this.loader = true;
    if (!this.authService.userUid) {
      this.toastService.show('Login to Continue', { classname: 'bg-warning text-dark' });
      return;
    }
    this.productData = (await this.backendService.readSpecificProductData(this.productId)).data();
    const callable = this.functions.httpsCallable('cart');
    try {
      const result = await callable({
        Mode: "ADD_TO_CART",
        Product: this.productData,
        UserUid: this.authService.user.uid.toString(),
        ProductQuantity: this.productQuantity
      }).toPromise().then(() => {
        this.loader = false;
      });
      this.toastService.show('Product Added to the Cart', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
    }
  }
  buyNow() {
    this.loader = true;
    this.addToCart().then(() => {
      this.loader = false;
      this.router.navigate(["Cart"]);
    }).catch((error) => {
      this.loader = false;
      console.log(error);
    });
  }
}
