import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { InventoryComponent } from './body/inventory/inventory.component';
import { LoginComponent } from './body/login/login.component';
import { LoaderComponent } from './body/loader/loader.component';
import { CreateProductComponent } from './body/Inventory/create-product/create-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatureCardComponent } from './body/Inventory/feature-card/feature-card.component';
import { ToastsContainer } from './body/toasts/toasts.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InventoryItemsComponent } from './body/inventory-items/inventory-items.component';
import { HomeComponent } from './body/home/home.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { UploadImageComponent } from './body/upload-image/upload-image.component';
import { ViewImagesComponent } from './body/inventory-items/view-images/view-images.component';
import { ProductDetailsComponent } from './body/product-details/product-details.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    InventoryComponent,
    LoginComponent,
    LoaderComponent,
    CreateProductComponent,
    FeatureCardComponent,
    ToastsContainer,
    InventoryItemsComponent,
    HomeComponent,
    DropzoneDirective,
    UploadImageComponent,
    ViewImagesComponent,
    ProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
  ],
  providers: [
    { provide: USE_AUTH_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9099] : undefined },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9101] : undefined },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9100] : undefined }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
