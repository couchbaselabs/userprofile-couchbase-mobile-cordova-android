import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

declare var CBL: any;

@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.component.html',
  styleUrls: ['./modalpage.component.scss'],
})
export class ModalpageComponent implements OnInit {

  universities: any = [];
  searchText: string;

  loading: any = null;

  constructor(public modalController: ModalController, public loadingController: LoadingController, public zone: NgZone) { }

  ngOnInit() {

  }

  dismiss(university: any) {
    this.modalController.dismiss({
      'result': university?.universities
    });
  }

  async onInput(event: any) {

    let searchText = event.target.value;

    if (searchText && searchText.trim() != "") {
      await this.presentLoading();

      let dbName = 'universities';
      let query = "SELECT * FROM universities WHERE LOWER(name) LIKE LOWER('%" + searchText + "%') AND country = 'United States'";

      CBL.query(dbName, query, async (rs) => {
          this.universities = rs;
          await this.dismissLoading();
      }, (err) => {
        this.dismissLoading(); 
        console.log(err)
      });

    } else {
      this.universities = [];
    }

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await this.loading.present();
  }


  async dismissLoading() {
    await this.loading.dismiss().then(() => console.log('dismissed'));
  }


  pickUni(university: any) {
    this.dismiss(university);
  }

}
