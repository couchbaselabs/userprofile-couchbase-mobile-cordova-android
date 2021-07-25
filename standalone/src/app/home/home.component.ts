import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SharedService } from '../shared.service';
import { AlertController } from '@ionic/angular';


declare var CouchbaseLitePlugin: any;


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

    const params = {
      dbName: this.email,
      docId: "user::" + this.email
    };

    CouchbaseLitePlugin.getDocument(params, (result: any) => {
      if (result) {
        this.address = result.address;
        this.name = result.name;

        if (result.profilePic) {

          const params = {
            dbName: this.email,
            blob: result.profilePic
          }

          CouchbaseLitePlugin.getBlob(params, (base64: string) => {

            this.profilePic = base64;

          }, (err: any) => {
            console.error(err)
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
    }

    this.camera.getPicture(options).then((base64) => {

      this.profilePic = base64;

    }, (e: any) => console.error(e));
  }

  saveProfile() {

    const config = {
      dbName: this.email,
      imageData: this.profilePic,
      contentType: 'image/jpeg'
    };

    CouchbaseLitePlugin.setBlob(config, (blob: any) => {

      const params = {
        dbName: this.email,
        docId: "user::" + this.email,
        document: {
          name: this.name,
          address: this.address,
          profilePic: blob
        }
      }

      CouchbaseLitePlugin.saveDocument(params, async (result: any) => {

        if (result == 'OK') {
          const alert = await this.alertController.create({
            header: 'Application Message',
            subHeader: '',
            message: 'Profile updated successfully',
            buttons: ['OK']
          });
          await alert.present();
        }

      }, (err: any) => {
        console.error(err);
      });

    }, (err: any) => {
      console.error(err);
    });

  }

  addChangeListener() {
    const params = {
      dbName: this.email
    }
    CouchbaseLitePlugin.addChangeListener(params, (result: any) => {
      if (result) {
        console.log(result);
      }
    }, (err: any) => {
      console.error(err);
    });
  }


  async logout() {

    const params = {
      dbName: this.email
    };

    CouchbaseLitePlugin.removeChangeListener(params, (result: any) => {
      CouchbaseLitePlugin.closeDatabase(params, (result: any) => {
        this.router.navigate(['/login']);
      }, (err: any) => {
        console.error(err)
      });
    }, (err: any) => {
      console.error(err);
    });

  }

}
