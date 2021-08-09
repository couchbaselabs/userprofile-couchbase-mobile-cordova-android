import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.component.html',
  styleUrls: ['./modalpage.component.scss'],
})
export class ModalpageComponent implements OnInit {

  
  universities: any =  [{"name": 'kwakwa'}];
  searchText: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() {

  }

  dismiss(university: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'result': university
    });
  }

  onInput(event: any) {

    alert(event.target.value);

  }

  onCancel(event: any) {
  }

  pickUni(university: any) {
    this.dismiss(university);
  }

}
