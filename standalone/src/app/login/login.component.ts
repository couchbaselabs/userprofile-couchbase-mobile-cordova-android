import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

declare var CBL: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  email: string;
  password: string;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.email = "";
    this.password = "";
  }

  onSubmit() {

    const config = {
      directory: 'couchdb',
      encryptionKey: '',
    };

    CBL.createDatabase(this.email, config, (result: any) => {
      console.log('Database Initialized : ' + result);

      this.sharedService.setDatabaseName(this.email);
      this.router.navigate(['/home']);

    }, (err: any) => {
      console.log(err);
    });
  }




}
