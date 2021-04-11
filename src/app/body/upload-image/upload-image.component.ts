import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AngularFireFunctions } from '@angular/fire/functions';
@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  @Input("file") file: File;
  @Input("productId") productId: string
  @Input("mode") mode: string
  @Input("imageIndex") imageIndex: number
  @Input("banner") banner: boolean
  @Input("sideBanner") sideBanner: boolean

  @Output() imageInfo = new EventEmitter<{ file: File }>();

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(private storage: AngularFireStorage, public toastService: ToastService, public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    if (this.banner) {
      this.startUploadBanner();
    }
    else {
      this.startUpload();
    }
  }

  startUpload() {
    const path = `ProductImages/${this.productId}/${this.file.name}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.storeImageData(path)
      }),
    );
  }

  startUploadBanner() {
    const path = `BannerImages/${this.file.name}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.storeBannerImageData(path)
      }),
    );
  }

  onDelete() {
    if (!this.banner) {
      this.deleteImage()
      this.imageInfo.emit({ file: this.file })
    }
    else {
      this.deleteBannerImage()
      this.imageInfo.emit({ file: this.file })
    }
  }

  async deleteImage() {
    const path = `ProductImages/${this.productId}/${this.file.name}`;
    const ref = this.storage.ref(path);
    await ref.delete().toPromise().then(() => {
      this.deleteImageData()
      this.toastService.show('Successfully Deleted the Image', { classname: 'bg-success text-light' });
    }).catch(err => {
      this.deleteImageData()
    });
  }

  async deleteBannerImage() {
    const path = `BannerImages/${this.file.name}`;
    const ref = this.storage.ref(path);
    await ref.delete().toPromise().then(() => {
      this.deleteBannerImageData()
      this.toastService.show('Successfully Deleted the Image', { classname: 'bg-success text-light' });
    }).catch(err => {
      this.deleteBannerImageData()
    });
  }

  async storeImageData(path: string) {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "CREATE_PRODUCT_IMAGE", ProductId: this.productId, DownloadURL: this.downloadURL, Path: path }).toPromise();
      this.toastService.show('Uploaded Successfully', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async storeBannerImageData(path: string) {
    const callable = this.functions.httpsCallable('banner');
    try {
      const result = await callable({ Mode: "CREATE_BANNER_IMAGE", DownloadURL: this.downloadURL, Path: path, UploadTime: Date.now(), SideBanner: this.sideBanner }).toPromise();
      this.toastService.show('Uploaded Successfully', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteImageData() {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "DELETE_PRODUCT_IMAGE", ImageIndex: this.imageIndex, ProductId: this.productId }).toPromise();
      this.toastService.show('Successfully Deleted Product Images', { classname: 'bg-danger text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteBannerImageData() {
    const callable = this.functions.httpsCallable('banner');
    try {
      const result = await callable({ Mode: "DELETE_BANNER_IMAGE", ImageIndex: this.imageIndex, SideBanner: this.sideBanner }).toPromise();
      this.toastService.show('Successfully Deleted Banner Image', { classname: 'bg-danger text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}
