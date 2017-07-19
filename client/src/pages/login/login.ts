import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { ContractsProvider } from '../../providers/contracts/contracts';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: string;
  password: string;
  btnLoginDisabled: boolean = true;
  serverIP: string;

  constructor(
    public nav: NavController,
    public http: Http,
    public itemService: ContractsProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public globalVars: GlobalVarsProvider,
    private storage: Storage
  ) {
    // Enable the settings menu
    menuCtrl.enable(true);

    // Fetch the locally stored connection data
    storage.get('serverIP').then((val) => {
      // Use the stored IP address if found
      if (val) {
        this.serverIP = val;
      } else {
        this.serverIP = globalVars.serverIP;
      }

      // Re-enable the button
      this.btnLoginDisabled = false;
    });
  }

  login() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let credentials = {
      username: this.username,
      password: this.password
    };

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loader.present();

    this.http.post('http://'+this.serverIP+':3000/auth/login', JSON.stringify(credentials), {headers: headers})
      .subscribe(res => {
        this.itemService.init(res.json());
        this.nav.setRoot(HomePage);
      }, (err) => {
        loader.dismiss();

        let alert = this.alertCtrl.create({
          title: 'Login Error',
          subTitle: JSON.parse(err._body).message,
          buttons: ['Dismiss']
        });
        alert.present();

        console.log(err);
      });
  }

  openSettingsMenu() {
    this.menuCtrl.toggle();
  }

  closeSettingsMenu() {
    this.menuCtrl.close();
  }

  settingsChangeIP() {
    let prompt = this.alertCtrl.create({
      title: 'Server IP Address',
      message: "Enter an IP address for the server",
      inputs: [
        {
          name: 'serverIP',
          value: this.serverIP
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.storage.set('serverIP',data.serverIP).then((val) => {
              this.serverIP = val;
            });
          }
        }
      ]
    });
    prompt.present();
  }

}
