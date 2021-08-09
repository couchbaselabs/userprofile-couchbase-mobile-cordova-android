import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

declare var CBL: any;

@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.component.html',
  styleUrls: ['./modalpage.component.scss'],
})
export class ModalpageComponent implements OnInit {


  universities: any = [];
  searchText: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() {

    let dbName = 'universities';
    let query = "SELECT * FROM universities";
    CBL.query(dbName, query, (rs) => {
      console.log(rs);
      if (rs && rs.length) {
        this.universities = rs;
      }
    }, (err) => {
      console.log(err)
    });


  }

  dismiss(university: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'result': university?.universities
    });
  }

  onInput(event: any) {

    let searchText = event.target.value;
 
    let dbName = 'universities';
    let query = "SELECT * FROM universities WHERE name like %" + searchText + "%";
    CBL.query(dbName, query, (rs) => {
      console.log(rs);
      if (rs && rs.length) {
        this.universities = rs;
      }
    }, (err) => {
      console.log(err)
    });

  }

  onCancel(event: any) {
  }

  pickUni(university: any) {
    this.dismiss(university);
  }

}
