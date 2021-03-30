import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestoreCollectionGroup } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductId } from '../../Interface/ProductInterface';
import { map } from 'rxjs/internal/operators/map';
import { Main } from '../../Interface/RawInterface';
import { Order } from '../../Interface/OrderInterface';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  productCollection: AngularFirestoreCollection<ProductId>
  productData: Observable<ProductId[]>

  orderCollection: AngularFirestoreCollection<Order>
  orderData: Observable<Order[]>

  rawDataObservable: Observable<Main>;
  rawDocument: AngularFirestoreDocument<Main>;

  public rawData: Main
  constructor(private db: AngularFirestore) { }


  readProductData(productId?: string) {
    this.productCollection = this.db.collection<ProductId>("Products", ref => {
      let queryRef: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (productId) {
        queryRef = queryRef.where("Id", "==", productId)
      }
      // queryRef = queryRef.orderBy("Id")
      return queryRef
    });
    this.productData = this.productCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ProductId;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readSpecificProductData(productId: string) {
    this.productCollection = this.db.collection<ProductId>("Products", ref => ref.where("Id", "==", productId));
    return this.productCollection.doc(productId).get().toPromise();
  }

  readOrderData() {
    this.orderCollection = this.db.collection<Order>("Orders");
    this.orderData = this.orderCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Order;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readRawData() {
    this.rawDocument = this.db.doc<Main>('RawData/AppDetails');
    this.rawDataObservable = this.rawDocument.snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as Main;
        this.rawData = data
        return { ...data };
      })
    )
  }

}
