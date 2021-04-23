import { Component, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Banner } from 'src/app/Interface/BannerInterface';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-side-banner',
  templateUrl: './side-banner.component.html',
  styleUrls: ['./side-banner.component.css']
})
export class SideBannerComponent implements OnInit {

  constructor(public backendService: BackendService,
    private modalService: NgbModal,
    private storage: AngularFireStorage,
    public toastService: ToastService,
    public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    this.backendService.sideBannerData.subscribe(data => {
      data.length === 2 ? this.disableAddingSideBanner = true : this.disableAddingSideBanner = false
      if (!data.length) {
        this.showSideBannerDropZone = true
      }
      else {
        this.showSideBannerDropZone = false
      }
    });
  }

  imageLoading: boolean = true;
  isHovering: boolean;
  files: File[] = [];
  showSideBannerDropZone: boolean = false
  disableAddingSideBanner: boolean = false

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
    this.showSideBannerDropZone = false
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

  toggleSideBannerDropZone() {
    this.showSideBannerDropZone = !this.showSideBannerDropZone
  }

  async deleteBannerImageData(bannerId: string) {
    const callable = this.functions.httpsCallable('banner');
    try {
      const result = await callable({ Mode: "DELETE_BANNER_IMAGE", BannerId: bannerId, SideBanner: true }).toPromise();
      this.toastService.show('Successfully Deleted Banner Image', { classname: 'bg-success text-light' });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

}
