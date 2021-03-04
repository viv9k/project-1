import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import firebase from "firebase"
import { BackendService } from 'src/app/services/backend.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string
  password: string
  username: string

  constructor(public authService: AuthService, public backendService: BackendService) { }
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
    });
  }
  onSignInwithEmail() {
    this.authService.loginUser(this.email, this.password).then(() => {
      this.readUserData()
    })
  }
  onSignUpwithEmail() {
    this.authService.createUser(this.email, this.password, this.username).then(() => {
      this.readUserData()
    })
  }
}
