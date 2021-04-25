import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, UserCart } from "../../Interface/UserInterface";
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { ToastService } from '../toast/toast.service';
import { Checkout } from '../../Interface/CheckoutInterface';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(public afauth: AngularFireAuth,
    private functions: AngularFireFunctions,
    private db: AngularFirestore,
    private toastService: ToastService) {
    this.afauth.user.subscribe(data => {
      this.user = data
      if (this.user) {
        this.readData(this.user.uid)
      }
    });
    }

  userCollection: AngularFirestoreCollection<UserCart>
  userData: Observable<UserCart[]>

  showAdminPanel: boolean = false
  user: User
  userUid: string
  cartLength: number
  billingAddress: Checkout;

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
      this.toastService.show(result, { classname: 'bg-success text-light' });
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
    this.user = null
    this.userData = null
    this.userUid = null
  }

  readData(uid?: string) {
    this.userCollection = this.db.collection<UserCart>("Users", ref => {
      let queryRef: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (uid) {
        this.userUid = uid
        queryRef = queryRef.where('uid', '==', uid);
      }
      queryRef = queryRef.orderBy("displayName")
      return queryRef;
    });
    this.userData = this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as UserCart;
        const id = a.payload.doc.id;
        this.cartLength = data.Cart.length;
        console.log(data.BillingDetails);
        this.billingAddress = data.BillingDetails;
        if (data.admin) {
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
