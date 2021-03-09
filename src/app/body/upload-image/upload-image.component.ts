import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast-service.service';
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
  constructor(private storage: AngularFireStorage, private db: AngularFirestore, public toastService: ToastService) { }

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
        this.db.collection("Images").doc(`${this.productId}_${this.file.name}`).set({ Id: this.file.name, DownloadURL: this.downloadURL, Path: path, ProductId: this.productId });
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
      this.db.collection("Images").doc(`${this.productId}_${this.file.name}`).delete();
      this.toastService.show('Successfully Deleted the Image', { classname: 'bg-success text-light' });
    });
  }
}
