import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { File } from '@ionic-native/file/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import { Platform } from '@ionic/angular';

declare var CBL: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {


  email: string;
  password: string;

  constructor(private router: Router, private sharedService: SharedService, private file: File, private zip: Zip, private platform: Platform) { }

  ionViewDidEnter() {
    this.email =  null;
    this.password = null;
  }

  ngOnInit() {

    let databaseName = "universities";
    this.platform.ready().then(() => {

      let databaseDir = databaseName + ".cblite2";
      this.file.checkDir(this.file.dataDirectory, databaseDir).then(rs => {

        this.initializeUniversityDB();

      }).catch(err => {

        let zipfileName = databaseName + ".zip";

        // path to place database zip file = src/assets/resource/

        // ionic automatically copies our asset to www directory
        let sourceDir = this.file.applicationDirectory + "www/assets/resource/";
        let targetDir = this.file.externalCacheDirectory;

        // copy zip file to cache directory from our asset directory then unzip on data directory.
        this.file.copyFile(sourceDir, zipfileName, targetDir, zipfileName).then(rs => {
          this.zip.unzip(rs.nativeURL, this.file.dataDirectory).then((resultCode) => {
            if (resultCode != -1) {
              this.initializeUniversityDB();
              this.createUniversityDatabaseIndexes();
            } else {
              console.error("Could not unzip file.");
            }
          }).catch(err => {
            console.error(err);
          });
        }).catch(err => {
          console.error(err);
        });

      });
    });

  }
  
  createUniversityDatabaseIndexes() {

    let dbName = "universities";
    let indexName = "nameLocationIndex";
    let indexes = ['name','location'];


    CBL.createValueIndex(dbName, indexName, indexes, (result: any) => {
      console.log('University database Index created: ' + result);
    }, (err: any) => {
      console.log(err);
    });
  }

  initializeUniversityDB() {
    let dbName = "universities";
    CBL.createDatabase(dbName, null, (result: any) => {
      console.log('University database Initialized : ' + result);
    }, (err: any) => {
      console.log(err);
    });
  }

  onSubmit() {

    const config = {
      directory: 'couchbase',
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
