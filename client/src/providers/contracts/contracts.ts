import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class ContractsProvider {

  data: any;
  db: any;
  remote: any;

  constructor(public zone: NgZone) {

  }

  init(details) {
    this.db = new PouchDB('prop-planned-works');

    this.remote = details.userDBs.ppw;

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);

    console.log(this.db);
  }

  logout() {
    this.data = null;

    this.db.destroy().then(() => {
      console.log("local database (PouchDB) removed");
    });
  }

  getContracts() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.data = [];

        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);
      }).catch((error) => {
        console.log(error);
      });
    });
  }

}
