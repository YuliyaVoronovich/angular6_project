import {Component, OnInit} from '@angular/core';
import {CompanyService} from '../../_services/company.service';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';
import {Company} from '../../_models/company.model';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {SharedService} from '../../_services/shared.service';

@Component({
  selector: 'app-admin-companies-list',
  templateUrl: './admin-companies-list.component.html',
  styleUrls: ['./admin-companies-list.component.css']
})
export class AdminCompaniesListComponent implements OnInit {

  public companies: Company[] = [];
  public search = {};
  public timer: any;

  /* public company: Company = new Company(null, '', '', '', '', '', null, null, '',
     '', '', null, null, null, [], null, false);*/

  constructor(private router: Router,
              private companyService: CompanyService,
              private loginService: LoginService,
              private sharedService: SharedService,) {
  }

  ngOnInit() {
    this.getCompanies();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  getCompanies() {
    return this.companyService.getCompanies(this.search).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.companies.push(data[i]);
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

  add(): void {
    this.router.navigate(['admin/companies/company']);
  }

  block(company: Company): void {
    this.companyService.block(company).subscribe(
      data => {
        if (data.status === 200) {
          company.disable = true;
          this.message('Компания заблокирована', true);
        } else {
          company.disable = false;
          this.message('Компанию не удалось заблокировать', true);
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
