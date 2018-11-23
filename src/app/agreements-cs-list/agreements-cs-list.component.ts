import { Component, OnInit } from '@angular/core';
import {AgreementService} from '../_services/agreement.service';
import {Router} from '@angular/router';
import {LoginService} from '../_services/login.service';
import {CsAgreement} from '../_models/CsAgreement.model';

@Component({
  selector: 'app-agreements-cs-list',
  templateUrl: './agreements-cs-list.component.html',
  styleUrls: ['./agreements-cs-list.component.css']
})
export class AgreementsCsListComponent implements OnInit {

  public agreements: CsAgreement[] = [];
  public search = {};
  public timer: any;

  constructor(private router: Router,
              private agreementService: AgreementService,
              private loginService: LoginService) { }

  ngOnInit() {
    this.getAgreements();
  }

  getAgreements() {
    return this.agreementService.getCsAgreements(this.search).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.agreements.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
        if (error.status === 403) {
          this.router.navigate(['/403']);
        }
      }
    );
  }

}
