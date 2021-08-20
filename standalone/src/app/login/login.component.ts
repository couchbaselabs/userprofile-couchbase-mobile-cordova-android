import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

declare var CBL: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {


  email: string;
  password: string;

  constructor(private router: Router, private sharedService: SharedService) { }

  ionViewDidEnter() {
    this.email = null;
    this.password = null;
  }

  onSubmit() {

    let config = new CBL.DatabaseConfiguration(this.email, { directory: 'couchbase', encryptionKey: ''});

    CBL.createOrOpenDatabase(config, (result: any) => {
      console.log('Database Initialized : ' + result);

      this.sharedService.setDatabaseName(this.email);
      this.router.navigate(['/home']);

    }, (err: any) => {
      console.log(err);
    });
  }




}
