import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Injectable()
export class Globals {
  public url = 'https://alfa.api.belan.by/api';
  //  public url = 'http://127.0.0.1:8000/api';

  public base_value = 25.5;

  public logoPhoneMts = 'assets/phone/mts.png';
  public logoPhoneVelcome = 'assets/phone/velcome.png';
  public logoPhoneLife = 'assets/phone/life.png';
  public logoPhoneBt = 'assets/phone/bt.jpg';
  public code = '';
  public number = '';


  constructor(private http: Http,
              private router: Router) {
  }

  getLogoPhone(code) {
    if (code === null) {
      return;
    }

    if (code === 'mts') {
      return '<img title="+37529" src="' + this.logoPhoneMts + '"/>';
    }
    if (code === 'velcome') {
      return '<img title="+37529" src="' + this.logoPhoneVelcome + '"/>';
    }
    if (code === 'life') {
      return '<img title="+37529" src="' + this.logoPhoneLife + '"/>';
    }
    if (code === 'bt') {
      return '<img title="+37529" src="' + this.logoPhoneBt + '"/>';
    }
  }

  transformPhone(phone) {
    let pos = 0;
    phone = phone.replace(/[^0-9]/gim, ''); // оставить только цифры

    pos = phone.indexOf('37517');
    if (pos !== -1) {
      this.code = this.getLogoPhone('bt');
      this.number = phone.substring(pos + 5);
    } else {

      pos = phone.indexOf('37525');
      if (pos !== -1) {
        this.code = this.getLogoPhone('life');
        this.number = phone.substring(pos + 5);
      } else {

        pos = phone.indexOf('37544');
        if (pos !== -1) {
          this.code = this.getLogoPhone('velcome');
          this.number = phone.substring(pos + 5);
        } else {

          pos = phone.indexOf('37533');
          if (pos !== -1) {
            this.code = this.getLogoPhone('mts');
            this.number = phone.substring(pos + 5);
          } else {

            pos = phone.indexOf('37529');
            if (pos !== -1) {
              this.number = phone.substring(pos + 5);
              if (this.number[0] === '6') {
                this.code = this.getLogoPhone('velcome');
              }
              if (this.number[0] === '1') {
                this.code = this.getLogoPhone('velcome');
              }
              if (this.number[0] === '3') {
                this.code = this.getLogoPhone('velcome');
              }
              if (this.number[0] === '9') {
                this.code = this.getLogoPhone('velcome');
              }
              if (this.number[0] === '8') {
                this.code = this.getLogoPhone('mts');
              }
              if (this.number[0] === '7') {
                this.code = this.getLogoPhone('mts');
              }
              if (this.number[0] === '2') {
                this.code = this.getLogoPhone('mts');
              }
              if (this.number[0] === '5') {
                this.code = this.getLogoPhone('mts');
              }
            } else {
              this.code = '';
              this.number = '';
            }
          }
        }
      }
    }
    return '<nobr>' + this.code + this.number + '</nobr>';
  }
}
