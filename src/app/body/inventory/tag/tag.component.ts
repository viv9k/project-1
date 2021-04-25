import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from 'src/app/Interface/TagInterface';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  constructor(
    public functions: AngularFireFunctions,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router,
    public backendService: BackendService,
  ) { }

  ngOnInit(): void {
    this.backendService.tagData.subscribe(data => {
      if (data.length <= 0) {
        this.showTag = true
      }
      else {
        this.showTag = false
      }
    });
  }

  tagName: string
  tagBody: string
  showTag: boolean
  showTagButton: boolean = true
  openModal(content) {
    this.modalService.open(content, { size: 'xl', windowClass: 'dark-modal', backdrop: "static", scrollable: true });
  }
  toggleTagDropZone() {
    this.showTag = !this.showTag
  }
  async createTag() {
    const callable = this.functions.httpsCallable('tag');
    try {
      const result = await callable({
        Mode: "CREATE_TAG",
        Name: this.tagName,
        Body: this.tagBody,
        UploadTime: Date.now(),
      }).toPromise();
      this.toastService.show('Successfully Added Tag', { classname: 'bg-success text-light' });
      console.log(result);
      this.modalService.dismissAll()
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['Inventory']);
      });

    } catch (error) { }
  }
  async modifyTag(tag: Tag) {
    const callable = this.functions.httpsCallable('tag');
    try {
      const result = await callable({
        Mode: "UPDATE_TAG",
        TagId: tag.Id,
        Name: tag.Name,
        Body: tag.Body,
      }).toPromise();
      this.toastService.show('Successfully Updated Tag', { classname: 'bg-warning text-light' });
      console.log(result);

    } catch (error) { }
  }
  async deleteTag(tag: Tag) {
    const callable = this.functions.httpsCallable('tag');
    try {
      const result = await callable({
        Mode: "DELETE_TAG",
        TagId: tag.Id,
      }).toPromise();
      this.toastService.show('Successfully Deleted Tag', { classname: 'bg-danger text-light' });
      console.log(result);

    } catch (error) { }
  }

}
