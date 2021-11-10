import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  databaseName: string;
  userEmail: string;
  replicator: any;

  constructor() { }


  setDatabaseName(name: string) {
    this.databaseName = name;
  }

  getDatabaseName() {
    return this.databaseName;
  }

  setUserEmail(email: string) {
    this.userEmail = email;
  }

  getUserEmail() {
    return this.userEmail;
  }

  setReplicator(replicator: any) {
    this.replicator = replicator;
  }
  
  getReplicator() {
    return this.replicator;
  }
}
