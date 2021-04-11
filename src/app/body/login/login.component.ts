import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import firebase from "firebase"
import { BackendService } from 'src/app/services/backend/backend.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input("link") link: boolean = false
  @Input("text") text: string

  email: string
  password: string
  username: string

  constructor(public authService: AuthService, public backendService: BackendService, private modalService: NgbModal, private router: Router) { }
  showSignUp: boolean = false;

  ngOnInit(): void {
  }
  changeUI() {
    this.showSignUp = !this.showSignUp
  }
  readUserData() {
    this.authService.readData(firebase.auth().currentUser.uid)
  }
  onSignInwithGoogle() {
    this.authService.googleSignIn().then(() => {
      this.readUserData()
    }).then(() => {
      this.router.navigate([""])
    });
    this.modalService.dismissAll();
  }
  onSignInwithEmail() {
    this.authService.loginUser(this.email, this.password).then(() => {
      this.readUserData()
    })
    this.modalService.dismissAll();

  }
  onSignUpwithEmail() {
    this.authService.createUser(this.email, this.password, this.username).then(() => {
      this.readUserData()
    });
    this.modalService.dismissAll();

  }
  openModal(content) {
    this.modalService.open(content);
  }
}
