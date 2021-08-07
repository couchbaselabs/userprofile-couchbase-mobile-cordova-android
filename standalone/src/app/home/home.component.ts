import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SharedService } from '../shared.service';
import { AlertController } from '@ionic/angular';


declare var CBL: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  email: string;
  name: string;
  address: string;
  profilePic: string;

  constructor(private camera: Camera, private sharedService: SharedService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {

    this.email = this.sharedService.getDatabaseName();
    this.loadProfile();
    this.addChangeListener();
  }

  loadProfile() {

    const dbName = this.email;
    const docId = 'user::' + this.email;

    CBL.getDocument(docId, dbName, (result: any) => {
      if (result) {
        this.address = result.address;
        this.name = result.name;

        if (result.profilePic) {
          CBL.getBlob(dbName, result.profilePic, (base64: any) => {
            this.profilePic = base64.content;
          }, (err: any) => {
            console.error(err);
          });
        }
      }
    }, (err: any) => {
      console.error(err);
    });

  }

  editPic() {

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
    };

    this.camera.getPicture(options).then((base64) => {

      this.profilePic = base64;

    }, (e: any) => console.error(e));
  }

  async saveProfile() {
    const docId = 'user::' + this.email;
    const dbName = this.email;


    const document = {
      name: this.name,
      address: this.address
    };

    CBL.saveDocument(docId, document, dbName, (result: any) => {

      if (result === 'OK') {

        if (this.profilePic) {
          const key = 'profilePic';
          const contentType = 'image/jpeg';
          const blobData = this.profilePic;

          CBL.mutableDocumentSetBlob(docId, dbName, key, contentType, blobData, (blob: any) => {
            this.presentAlert();
          }, (err: any) => {
            console.error(err);
          });
        } else {
          this.presentAlert();
        }
      }

    }, (err: any) => {
      console.error(err);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Application Message',
      subHeader: '',
      message: 'Profile updated successfully',
      buttons: ['OK']
    });
  
    await alert.present();
  } 

  addChangeListener() {
    CBL.dbAddListener(this.email, function() {

    }, (result: any) => {
      if (result) {
        console.log(result);
      }
    }, (err: any) => {
      console.error(err);
    });
  }


  async logout() {

    CBL.dbRemoveListener(this.email, (result: any) => {
      CBL.closeDatabase(this.email, (result: any) => {
        this.router.navigate(['/login']);
      }, (err: any) => {
        console.error(err);
      });
    }, (err: any) => {
      console.error(err);
    });

  }

}
