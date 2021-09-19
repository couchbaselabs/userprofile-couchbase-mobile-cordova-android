import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {Zip} from '@ionic-native/zip/ngx';
import { ModalpageComponent } from './modalpage/modalpage.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, ModalpageComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Camera, File, Zip],
  bootstrap: [AppComponent],
})
export class AppModule {}
