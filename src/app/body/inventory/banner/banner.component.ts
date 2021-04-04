import { Component, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Banner } from 'src/app/Interface/BannerInterface';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  constructor(public backendService: BackendService,
    private modalService: NgbModal,
    private storage: AngularFireStorage,
    public toastService: ToastService,
    public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    this.backendService.readBannerData()
    this.backendService.bannerData.subscribe(data => {
      if (!data.length) {
        this.showBannerDropZone = true
      }
      else {
        this.showBannerDropZone = false
      }
    });
  }

  imageLoading: boolean = true;
  isHovering: boolean;
  files: File[] = [];
  showBannerDropZone: boolean = false

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
    this.showBannerDropZone = false
  }

  async deleteImage(path: string, loadingTemplate, banner: Banner) {
    this.toastService.show(loadingTemplate, { classname: 'bg-warning text-dark', delay: 800 });
    const ref = this.storage.ref(path);
    await ref.delete().toPromise().then(() => {
      this.deleteBannerImageData(banner.Id)
    }).catch(err => {
      this.deleteBannerImageData(banner.Id)
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

  toggleBannerDropZone() {
    this.showBannerDropZone = !this.showBannerDropZone
  }

  async deleteBannerImageData(bannerId: string) {
    const callable = this.functions.httpsCallable('banner');
    try {
      const result = await callable({ Mode: "DELETE_BANNER_IMAGE", BannerId: bannerId }).toPromise();
      this.toastService.show('Successfully Deleted Banner Image', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  async updateBannerData(banner: Banner) {
    const callable = this.functions.httpsCallable('banner');
    try {
      const result = await callable({ Mode: "UPDATE_LINK_DESCRIPTION", BannerId: banner.Id, Link: banner.Link, Description: banner.Description }).toPromise();
      this.toastService.show('Successfully Update Banner', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}
