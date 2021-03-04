import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from "../Interface/UserInterface";
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(public afauth: AngularFireAuth, private functions: AngularFireFunctions, private db: AngularFirestore) { }

  userCollection: AngularFirestoreCollection<User>
  userData: Observable<User[]>

  showAdminPanel: boolean = false
  user: User
  async createUser(email: string, password: string, username: string) {
    await this.afauth.createUserWithEmailAndPassword(email, password).then((credential) => {
      this.user = credential.user
    });
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: username
    }).then(() => {
      this.createUserData(user);
    }).catch(function (error) {
      console.log(error);
    });
  }

  async loginUser(email: string, password: string) {
    await this.afauth.signInWithEmailAndPassword(email, password).then(credential => {
      this.user = credential.user
    })
  }

  async createUserData(user: User) {
    const callable = this.functions.httpsCallable('createNewUser');
    try {
      const result = await callable({ uid: user.uid, photoURL: user.photoURL, displayName: user.displayName, email: user.email, phoneNumber: user.phoneNumber, providerId: user.providerId }).toPromise();
      console.log(result);
    } catch (error) {
      console.error("Error", error);
    }
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afauth.signInWithPopup(provider);
    this.user = credential.user
    return this.createUserData(credential.user);
  }

  async logout() {
    await this.afauth.signOut();
    this.user = undefined
  }



  readData(uid?: string) {
    this.userCollection = this.db.collection<User>("Users", ref => {
      let queryRef: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (uid) {
        queryRef = queryRef.where('uid', '==', uid);
      }
      queryRef = queryRef.orderBy("displayName")
      return queryRef;
    });
    this.userData = this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        if (uid && data.admin) {
          this.showAdminPanel = true
        }
        else {
          this.showAdminPanel = false
        }
        return { id, ...data };
      }))
    );
  }



}