import { Component } from "@angular/core";
import { NavController, AlertController } from 'ionic-angular';
import { ContractsProvider } from '../../providers/contracts/contracts';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: any;

  constructor(
    public nav: NavController,
    public contractService: ContractsProvider,
    public alertCtrl: AlertController
  ) {

  }

  ionViewDidLoad() {
    this.contractService.getContracts().then((data) => {
      this.items = data;
    });
  }

  logout() {
    this.contractService.logout();
    this.items = null;
    this.nav.setRoot(LoginPage);
  }

}
