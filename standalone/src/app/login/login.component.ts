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

  userProfileDBName:string = "userprofile"
  email: string;
  password: string;

  constructor(private router: Router, private sharedService: SharedService) { }

  ionViewDidEnter() {
    this.email = null;
    this.password = null;
  }

  onSubmit() {

    let config = new CBL.DatabaseConfiguration(this.userProfileDBName, { directory: 'couchbase', encryptionKey: ''});

    CBL.createOrOpenDatabase(config, (result: any) => {
      console.log('Database Initialized : ' + result);
	  this.sharedService.setUserEmail(this.email);
      this.sharedService.setDatabaseName(this.userProfileDBName);
      this.router.navigate(['/home']);

    }, (err: any) => {
      console.log(err);
    });
  }




}
