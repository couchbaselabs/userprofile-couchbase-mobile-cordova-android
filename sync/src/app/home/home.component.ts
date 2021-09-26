import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SharedService } from '../shared.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalpageComponent } from '../modalpage/modalpage.component';


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
  university: string;
  docId: string;
  dbName: string;

  constructor(private camera: Camera, private sharedService: SharedService,
    private router: Router, private alertController: AlertController,
    public modalController: ModalController, public zone: NgZone) { }


  ngOnInit() {

    this.email = this.sharedService.getUserEmail();
    this.dbName = this.sharedService.getDatabaseName();
    this.docId = 'user::' + this.email;
    this.addChangeListener();
    this.addLiveQueryListener();
  }

  addLiveQueryListener() {

    var that = this;

    //attaching function to window object to make it global.
    (window as any).onQueryChange = function (change) {
      if (change && change.length > 0) {
        var liveProfile = change[0].userprofile;
        if (liveProfile) {
          that.zone.run(() => {
            that.updateView(liveProfile)
          });
        }
      }
    }

    const query = "Select * from " + this.dbName + " WHERE email = '" + this.email + "'";
    CBL.queryAddListener(this.dbName, query, 'onQueryChange', function (rs) { console.log(rs); }, function (err) { console.log(err) });

  }

  updateView(result: any) {

    this.name = result.name;
    this.address = result.address;
    this.university = result.university;

    if (result.profilePic) {
      CBL.getBlob(this.dbName, result.profilePic, (base64: any) => {
        this.profilePic = base64.content;
      }, (err: any) => {
        console.error(err);
      });
    } 
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
 
    let document = {
      email: this.email,
      name: this.name,
      address: this.address,
      university: this.university,
      type: "user"
    };

    if (this.profilePic) {
      const contentType = 'image/jpeg';
      const blobData = this.profilePic;

      CBL.saveBlob(this.dbName, contentType, blobData,  (blob: any) => {
        document['profilePic'] = blob;
        CBL.saveDocument(this.docId, document, this.dbName, (result: any) => {
          if (result === 'OK') {
            this.presentAlert();
          }
        }, (err: any) => {
          console.error(err);
        });
      }, (err: any) => {
        console.error(err);
      });
    } else {
      CBL.saveDocument(this.docId, document, this.dbName, (result: any) => {
        if (result === 'OK') {
          this.presentAlert();
        }
      }, (err: any) => {
        console.error(err);
      });
    }
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
    (window as any).onDbChange = function (events) {
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


  logout() {
    CBL.replicationRemoveListener(this.dbName, (result: any) => {
      console.log('Replicator listener removed.');
      CBL.replicatorStop(this.dbName, (result: any) => {
        console.log('Replicator stopped.');
        CBL.dbRemoveListener(this.dbName, (result: any) => {
          console.log('Database listener removed.');
          CBL.closeDatabase(this.dbName, (result: any) => {
            console.log('Database closed.');
            this.router.navigate(['/login']);
          }, (err: any) => {
            console.error(err);
          });
        }, (err: any) => {
          console.error(err);
        });
      }, (err: any) => {
        console.error(err);
      });
    }, (err: any) => {
      console.error(err);
    });

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalpageComponent
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.result) {
      this.university = data.result.name;
    }

  }



}
