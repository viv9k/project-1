import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductId } from '../Interface/ProductInterface';
import { map } from 'rxjs/internal/operators/map';
import { Main } from '../Interface/RawInterface';
import { Order } from '../Interface/OrderInterface';
import { Image } from '../Interface/ImageInterface';

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

  imageCollection: AngularFirestoreCollection<Image>
  imageData: Observable<Image[]>

  public rawData: Main
  constructor(private db: AngularFirestore) { }


  readProductData() {
    this.productCollection = this.db.collection<ProductId>("Products");
    this.productData = this.productCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ProductId;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readImageData() {
    this.imageCollection = this.db.collection<Image>("Images");
    this.imageData = this.imageCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Image;
        const Id = a.payload.doc.id;
        console.log(data);
        return { Id, ...data };
      }))
    );
  }

  readOrderData() {
    this.orderCollection = this.db.collection<Order>("Orders");
    this.orderData = this.orderCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Order;
        const Id = a.payload.doc.id;
        console.log(data);
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
