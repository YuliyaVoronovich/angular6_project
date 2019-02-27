import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../_services/shared.service';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';
import {SiteService} from '../../_services/site_service';
import {Site} from '../../_models/Site';
import {Company} from "../../_models/Company.model";

@Component({
  selector: 'app-admin-sites-list',
  templateUrl: './admin-sites-list.component.html',
  styleUrls: ['./admin-sites-list.component.css']
})
export class AdminSitesListComponent implements OnInit {


  public sites: Site[] = [];
  public site: Site = new Site(0, '', false, 0);
  public timer: any;
  public hide = false;

  constructor(private router: Router,
              private siteService: SiteService,
              private loginService: LoginService,
              private sharedService: SharedService) {

  }

  ngOnInit() {
    this.getSites();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }


  getSites() {
    this.sites = [];

    return this.siteService.getSites().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.sites.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
      });
  }

  save(site: Site) {
    console.log(site);

    if (site.id !== 0) {
      this.siteService.update(site).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Сайт обновлен', false);
            this.router.navigate(['admin/sites']);
          } else {
            this.message('Ошибка!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);
          }
        }
      );
    } else {
      this.siteService.create(site).subscribe(
        data => {
          if (data.status === 201) {
            this.message('Сайт создан', false);
            this.getSites();
            this.hide = false;
            this.site.title = '';
          } else {
            this.message('Ошибка!', true);
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['']);
          } else {
            this.message('Ошибка!', true);
          }
        }
      );
    }
  }

  block(site: Site): void {
    this.site.block = true;
    this.siteService.update(site).subscribe(
      data => {
        if (data.status === 200) {
          site.block = true;
          this.message('Сайт заблокирован', true);
        } else {
          this.message('Сайт не удалось заблокировать', true);
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

  unBlock(site: Site): void {
    this.site.block = false;
    this.siteService.update(site).subscribe(
      data => {
        if (data.status === 200) {
          site.block = false;
          this.message('Сайт разблокирован', false);
        } else {
          this.message('Сайт не удалось разблокировать', true);
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
