import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastService } from 'src/app/services/toast-service.service';
@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit {
  @Input("productId") productId: string

  constructor(public backendService: BackendService, private modalService: NgbModal, private storage: AngularFireStorage, private db: AngularFirestore, public toastService: ToastService) { }

  ngOnInit(): void { }

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

  openModal(content) {
    this.modalService.open(content, { size: 'xl', windowClass: 'dark-modal', scrollable: true });
  }


  async deleteImage(path: string, fileName: string) {
    const ref = this.storage.ref(path);
    await ref.delete().toPromise().then(() => {
      this.db.collection("Images").doc(`${this.productId}_${fileName}`).delete().then(() => {
        console.log("Deleted in DB");
      }).catch(err => {
        console.log(err);
      });
      this.toastService.show('Successfully Deleted the Image', { classname: 'bg-success text-light' });
    });
  }
  deleteImageFromArray(data: { file: File }) {
    this.files = this.files.filter((file) => {
      return file.name != data.file.name
    })
  }
}
