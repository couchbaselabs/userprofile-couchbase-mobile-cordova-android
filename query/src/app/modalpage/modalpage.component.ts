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
  nameSearchText: string;
  countrySearchText: string;

  loading: any = null;

  constructor(public modalController: ModalController, public loadingController: LoadingController, public zone: NgZone) { }

  ngOnInit() {

  }

  dismiss(university: any) {
    this.modalController.dismiss({
      'result': university?.universities
    });
  }


  async search() {
    if (this.nameSearchText && this.nameSearchText.trim() != "") {
      await this.presentLoading();

      let dbName = 'universities';

      let whereExpr = "LOWER(name) LIKE '%" + this.nameSearchText.toLowerCase() + "%'";

      if (this.countrySearchText != null && this.countrySearchText != "") {
        let countryQueryExpr = "LOWER(country) LIKE '%" + this.countrySearchText.toLowerCase() + "%'";
        whereExpr += " AND " + countryQueryExpr;
      }

      let queryStr = "SELECT * FROM universities WHERE " + whereExpr;

      CBL.query(dbName, queryStr, async (rs) => {
        this.zone.run(() => {
          this.universities = rs; 
        });
        await this.dismissLoading();
      }, (err) => {
        this.dismissLoading();
        console.log(err);
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
