import {Component, OnInit, Inject} from '@angular/core';
import {CompanyService} from '../../_services/company.service';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';
import {Company} from '../../_models/company.model';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {SharedService} from '../../_services/shared.service';
import {Module} from '../../_models/module.model';
import {CompanyHistoryBlock} from '../../_models/companyHistoryBlock.model';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ModuleService} from '../../_services/module.service';

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

  constructor(public dialog: MatDialog,
              private router: Router,
              private companyService: CompanyService,
              private loginService: LoginService,
              private sharedService: SharedService) {
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

  openDialogBlock(company: Company): void {
    const dialogRef = this.dialog.open(DialogCompanyBlockComponent, {
      data: {company: company}
    });
  }

  openDialogUnblock(company: Company): void {
    const dialogRef = this.dialog.open(DialogCompanyUnblockComponent, {
      data: {company: company}
    });
  }
}

@Component({
  selector: 'app-dialog-company-block',
  templateUrl: 'dialog-company-block.component.html',
  styleUrls: ['../admin-company-modificate/admin-company-modificate.component.css']
})
export class DialogCompanyBlockComponent  implements OnInit {
  public timer: any;
  public company_history_blocks: CompanyHistoryBlock = new CompanyHistoryBlock(null, null, null, null, null, null);

  constructor(public dialogRef: MatDialogRef<DialogCompanyBlockComponent>,
              private loginService: LoginService,
              private companyService: CompanyService,
              private router: Router,
              private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  block(company: Company): void {
    this.company_history_blocks.status = 1;
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
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-dialog-company-unblock',
  templateUrl: 'dialog-company-unblock.component.html',
  styleUrls: ['../admin-company-modificate/admin-company-modificate.component.css']
})
export class DialogCompanyUnblockComponent  implements OnInit {

  public modules: Module[] = [];
  public timer: any;

  constructor(public dialogRef: MatDialogRef<DialogCompanyUnblockComponent>,
              private companyService: CompanyService,
              private moduleSevice: ModuleService,
              private loginService: LoginService,
              private router: Router,
              private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.getModules();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  getModules() {
    return this.moduleSevice.getModules().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.modules.push(data[i]);
        }
      }
    );
  }

  unblock(company: Company): void {
    this.companyService.unblock(company).subscribe(
      data => {
        if (data.status === 200) {
          company.disable = true;
          this.message('Компания разблокирована', true);
        } else {
          company.disable = false;
          this.message('Компанию не удалось разблокировать', true);
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

