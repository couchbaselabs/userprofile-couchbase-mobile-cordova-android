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

  userProfileDBName = "userprofile";
  externalDBName = "universities";
  email: string = 'demo@example.com';
  password: string;

  constructor(private router: Router, private sharedService: SharedService, private file: File, private zip: Zip, private platform: Platform) { }

  ionViewDidEnter() {
    this.email =  'demo@example.com';
    this.password = 'asd';
  }

  ngOnInit() {

    this.platform.ready().then(() => {
      let zipfileName = this.externalDBName + ".zip";
      let config = new CBL.DatabaseConfiguration(this.externalDBName, { directory: 'couchbase', encryptionKey: '' });

      CBL.databaseExists(config, result => {
        if (result) {
          this.openUniversityDatabase();
        } else {

          // path to place database zip file = src/assets/resource/
          // ionic automatically copies our asset to www directory
          let sourceDir = this.file.applicationDirectory + "www/assets/resource/";
          let targetDir = this.file.externalCacheDirectory;

          // copy zip file to cache directory from our asset directory then unzip on data directory.
          this.file.copyFile(sourceDir, zipfileName, targetDir, zipfileName).then(rs => {
            this.zip.unzip(rs.nativeURL, this.file.dataDirectory).then((resultCode) => {

              if (resultCode != -1) {

                let newConfig = new CBL.DatabaseConfiguration(this.externalDBName, { directory: 'couchbase', encryptionKey: '' });
                CBL.copyDatabase(this.externalDBName, newConfig, (result: any) => {
                  this.createUniversityDatabaseIndexes();
                }, (err: any) => {
                  console.log(err);
                });

              } else {
                console.error("Could not unzip file.");
              }

            }).catch(err => {
              console.error(err);
            });
          }).catch(err => {
            console.error(err);
          });
        }
      }, err => {
        console.error(err);
      });
    });
  }


  openUniversityDatabase() {

    let config = new CBL.DatabaseConfiguration(this.externalDBName, { directory: 'couchbase', encryptionKey: '' });
    CBL.createOrOpenDatabase(config, (result: any) => {
      console.log('University database Initialized : ' + result);
    }, (err: any) => {
      console.log(err);
    });
  }

  createUniversityDatabaseIndexes() {

    let indexName = "nameLocationIndex";
    let indexExpressions = ['name', 'location'];

    CBL.createValueIndex(this.externalDBName, indexName, indexExpressions, (result: any) => {
      console.log('University database Index created: ' + result);
    }, (err: any) => {
      console.log(err);
    });
  }

  onSubmit() {

    let config = new CBL.DatabaseConfiguration(this.userProfileDBName, { directory: 'userprofile', encryptionKey: '' });
    CBL.createOrOpenDatabase(config, async (result: any) => {
      console.log('Database Initialized : ' + result);
      this.sharedService.setUserEmail(this.email);
      this.sharedService.setDatabaseName(this.userProfileDBName);
      let replicatorStarted = await this.startPushAndPullReplicationForCurrentUser();
      if (replicatorStarted) {
        this.addReplicatorListener();
      }
      this.router.navigate(['/home']);

    }, (err: any) => {
      console.log(err);
    });
  }


  addReplicatorListener() {
    //attaching function to window object to make it global.  
    (window as any).replicatorCB = function(result) {
      console.log("Replicator Listener:\n" + JSON.stringify(result));
    }

    CBL.replicationAddListener(this.sharedService.getDatabaseName(), 'replicatorCB', function(rs) { console.log('Replicator Listener added:' + rs) }, function(err) { console.log(err) });
  }



  startPushAndPullReplicationForCurrentUser() {

    return new Promise((resolve, reject) => {

      var replicatorConfig = CBL.ReplicatorConfiguration(this.sharedService.getDatabaseName(), 'ws://10.0.2.2:4984/' + this.sharedService.getDatabaseName());
      replicatorConfig.continuous = true;
      replicatorConfig.authenticator = CBL.BasicAuthenticator(this.sharedService.getUserEmail(), 'password');
      replicatorConfig.channels = ['channel.' + this.sharedService.getUserEmail()];
      replicatorConfig.replicatorType = CBL.ReplicatorType.PUSH_AND_PULL;

      CBL.replicatorStart(replicatorConfig, (rs) => {
        resolve(true);
      }, (err: any) => {
        console.log("Failed to start replicator: " + err);
        reject(false);
      });
    });
  }





}
