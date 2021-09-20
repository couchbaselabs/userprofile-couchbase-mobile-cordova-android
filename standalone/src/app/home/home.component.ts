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

  dbName: string;
  email: string;
  docId: string;
  name: string;
  address: string;
  profilePic: string;
  

  constructor(private camera: Camera, private sharedService: SharedService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {

    this.email = this.sharedService.getUserEmail();
    this.dbName = this.sharedService.getDatabaseName();
    this.docId = 'user::' + this.email;
    this.loadProfile();
    this.addChangeListener();
  }

  loadProfile() {

    CBL.getDocument(this.docId, this.dbName, (result: any) => {
      if (result) {
        this.address = result.address;
        this.name = result.name;

        if (result.profilePic) {
          CBL.getBlob(this.dbName, result.profilePic, (base64: any) => {
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


    const document = {
      name: this.name,
      address: this.address,
      type: "user"
    };

    CBL.saveDocument(this.docId, document, this.dbName, (result: any) => {

      if (result === 'OK') {

        if (this.profilePic) {
          const key = 'profilePic';
          const contentType = 'image/jpeg';
          const blobData = this.profilePic;

          CBL.mutableDocumentSetBlob(this.docId, this.dbName, key, contentType, blobData, (blob: any) => {
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

    //attaching function to window object to make it global.
    (window as any).onDbChange = function(events) {
      console.log(events);
    }

    CBL.dbAddListener(this.dbName, 'onDbChange', (result: any) => {
      if (result) {
        console.log(result);
      }
    }, (err: any) => {
      console.error(err);
    });
  }


  async logout() {

    CBL.dbRemoveListener(this.dbName, (result: any) => {
      CBL.closeDatabase(this.dbName, (result: any) => {
        this.router.navigate(['/login']);
      }, (err: any) => {
        console.error(err);
      });
    }, (err: any) => {
      console.error(err);
    });

  }

}
