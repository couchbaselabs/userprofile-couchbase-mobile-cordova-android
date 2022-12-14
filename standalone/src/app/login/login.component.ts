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
    if (!CBL) {
      alert('Internal error. Make sure the plugin is installed properly.')
    }

    //enabling native logging
    CBL.enableConsoleLogging(CBL.Domain.ALL, CBL.LogLevel.DEBUG, (result) => console.log('Native Logs Enabled: ' + result), (error) => console.log(error));

    let config = new CBL.DatabaseConfiguration({ directory: 'couchbase', encryptionKey: ''});

    CBL.createOrOpenDatabase(this.userProfileDBName, config, (result: any) => {
      console.log('Database Initialized : ' + result);
	    this.sharedService.setUserEmail(this.email);
      this.sharedService.setDatabaseName(this.userProfileDBName);
      this.router.navigate(['/home']);

    }, (err: any) => {
      console.log(err);
    });
  }




}
