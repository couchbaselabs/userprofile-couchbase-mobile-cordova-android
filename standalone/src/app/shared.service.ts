import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  databaseName: string;

  constructor() { }


  setDatabaseName(name: string) {
    this.databaseName = name;
  }

  getDatabaseName() {
    return this.databaseName;
  }
}
