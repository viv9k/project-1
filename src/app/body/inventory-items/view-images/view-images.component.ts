import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend/backend.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastService } from "src/app/services/toast/toast.service";
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit {
  @Input("productId") productId: string

  constructor(public backendService: BackendService, private modalService: NgbModal,
    private storage: AngularFireStorage,
    public toastService: ToastService, public functions: AngularFireFunctions) { }

  ngOnInit(): void { }

  imageLoading: boolean = true;
  isHovering: boolean;
  files: File[] = [];
  showDropZone: boolean = false

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

  closeModal() {
    this.modalService.dismissAll()
    this.files = []
    this.showDropZone = false
  }

  async deleteImage(path: string, loadingTemplate, index: number) {
    this.toastService.show(loadingTemplate, { classname: 'bg-warning text-dark', delay: 800 });
    const ref = this.storage.ref(path);
    await ref.delete().toPromise().then(() => {
      this.deleteImageData(index)
    }).catch(err => {
      this.deleteImageData(index)
    });
  }

  deleteImageFromArray(data: { file: File }) {
    this.files = this.files.filter((file) => {
      return file.name != data.file.name
    })
  }

  onImageLoad() {
    this.imageLoading = false;
  }

  toggleDropZone() {
    this.showDropZone = !this.showDropZone
  }

  async deleteImageData(index: number) {
    const callable = this.functions.httpsCallable('product');
    try {
      const result = await callable({ Mode: "DELETE_PRODUCT_IMAGE", ImageIndex: index, ProductId: this.productId }).toPromise();
      this.toastService.show('Successfully Deleted Product Image', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}
