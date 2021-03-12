import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast-service.service';
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

  @Output() imageInfo = new EventEmitter<{ file: File }>();
  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  constructor(private storage: AngularFireStorage, public toastService: ToastService, public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    this.startUpload();
  }

  startUpload() {
    // The storage path
    const path = `ProductImages/${this.productId}/${this.productId}_${this.file.name}`;
    // Reference to storage bucket
    const ref = this.storage.ref(path);
    // The main task
    this.task = this.storage.upload(path, this.file);
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.storeImageData(path)
      }),
    );
  }

  onDelete() {
    this.deleteImage()
    this.imageInfo.emit({ file: this.file })
  }

  async deleteImage() {
    const path = `ProductImages/${this.productId}/${this.productId}_${this.file.name}`;
    const ref = this.storage.ref(path);
    await ref.delete().toPromise().then(() => {
      this.deleteImageData()
      this.toastService.show('Successfully Deleted the Image', { classname: 'bg-success text-light' });
    }).catch(err => {
      this.deleteImageData()
    });
  }

  async storeImageData(path: string) {
    const callable = this.functions.httpsCallable('productImage');
    try {
      const result = await callable({ Mode: "CREATE", Id: this.file.name, DownloadURL: this.downloadURL, Path: path, ProductId: this.productId }).toPromise();
      this.toastService.show('Uploaded Successfully', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteImageData() {
    const callable = this.functions.httpsCallable('productImage');
    try {
      const result = await callable({ Mode: "DELETE", Id: this.file.name, ProductId: this.productId }).toPromise();
      // this.toastService.show('Successfully Uploaded Product Images', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

}
