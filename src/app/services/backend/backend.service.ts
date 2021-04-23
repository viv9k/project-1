import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductId } from '../../Interface/ProductInterface';
import { Category } from '../../Interface/CategoryInterface';
import { Banner, SideBanner } from '../../Interface/BannerInterface';
import { map } from 'rxjs/internal/operators/map';
import { Main } from '../../Interface/RawInterface';
import { Order } from '../../Interface/OrderInterface';
import firebase from 'firebase';
import { Coupon } from 'src/app/Interface/CouponInterface';
import { Tag } from 'src/app/Interface/TagInterface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  productCollection: AngularFirestoreCollection<ProductId>
  productData: Observable<ProductId[]>

  orderCollection: AngularFirestoreCollection<Order>
  orderData: Observable<Order[]>

  categoryCollection: AngularFirestoreCollection<Category>
  categoryData: Observable<Category[]>

  bannerCollection: AngularFirestoreCollection<Banner>
  bannerData: Observable<Banner[]>

  sideBannerCollection: AngularFirestoreCollection<SideBanner>
  sideBannerData: Observable<SideBanner[]>

  couponCollection: AngularFirestoreCollection<Coupon>
  couponData: Observable<Coupon[]>

  tagCollection: AngularFirestoreCollection<Tag>
  tagData: Observable<Tag[]>

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

  readOrderData(uid?: string) {
    this.orderCollection = this.db.collection<Order>("Orders", ref => ref.where("UserUid", "==", uid));
    this.orderData = this.orderCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Order;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readCategoryData() {
    this.categoryCollection = this.db.collection<Category>("Category", ref => ref.orderBy("Position"));
    this.categoryData = this.categoryCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readBannerData() {
    this.bannerCollection = this.db.collection<Banner>("Banner", ref => ref.orderBy("UploadTime"));
    this.bannerData = this.bannerCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Banner;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readSideBannerData() {
    this.sideBannerCollection = this.db.collection<SideBanner>("SideBanner", ref => ref.orderBy("UploadTime"));
    this.sideBannerData = this.sideBannerCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SideBanner;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readCouponData() {
    this.couponCollection = this.db.collection<Coupon>("CouponCode");
    this.couponData = this.couponCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Coupon;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  readTagData() {
    this.tagCollection = this.db.collection<Tag>("Tag", ref => ref.orderBy("UploadTime"));
    this.tagData = this.tagCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Tag;
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

  readAdminOrderData() {
    this.orderCollection = this.db.collection<Order>("Orders");
    this.orderData = this.orderCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Order;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }
}
