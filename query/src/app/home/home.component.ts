import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private camera: Camera, private sharedService: SharedService, private router: Router, private alertController: AlertController, public modalController: ModalController) { }


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

      this.zone.run(() => {
        this.profilePic = base64;
      });

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
        this.saveDocument(document);
      }, (err: any) => {
        console.error(err);
      });
    } else {
      this.saveDocument(document);
    }
  }

  async saveDocument(document: any){
    CBL.saveDocument(this.docId, document, this.dbName, (result: any) => {
      if (result === 'OK') {
        this.presentAlert();
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


  logout() {
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
