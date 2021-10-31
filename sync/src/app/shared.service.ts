import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  databaseName: string;
  userEmail: string;
  replicatorHash: number;
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

  setReplicatorHash(hash: number) {
    this.replicatorHash = hash;
  }

  getReplicatorHash() {
    return this.replicatorHash;
  }

  setReplicator(replicator: any) {
    this.replicator = replicator;
  }
  
  getReplicator() {
    return this.replicator;
  }
}
