import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Module} from '../../_models/module.model';
import {LoginService} from '../../_services/login.service';
import {Router} from '@angular/router';
import {ModuleService} from '../../_services/module.service';
import {Company} from '../../_models/company.model';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';
import {SharedService} from '../../_services/shared.service';

@Component({
  selector: 'app-admin-modules-list',
  templateUrl: './admin-modules-list.component.html',
  styleUrls: ['./admin-modules-list.component.css']
})
export class AdminModulesListComponent implements OnInit {

  public modules: Module[] = [];
  public editRowId: any;
  public timer: any;

  @ViewChild('myInput') inputEl: ElementRef;

  constructor(private router: Router,
              private moduleService: ModuleService,
              private loginService: LoginService,
              private sharedService: SharedService) {

  }

  ngOnInit() {
    this.getModules();
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  toggle(id) {
    this.editRowId = id;
    setTimeout(() => this.inputEl.nativeElement.focus(), 0);
  }

  change(module: Module) {
    this.save(module);
    this.editRowId = 0;
  }

  add() {
    /*const indexForId = this.modules.length + 1
    this.modules.push({
      id: indexForId, title: ''
    });*/
  }

  getModules() {
    return this.moduleService.getModules().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.modules.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
      });
  }
  save(module: Module) {
    console.log(module);

    if (module.id !== null) {
      this.moduleService.update(module).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Модуль обновлен', false);
            this.router.navigate(['admin/modules']);
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
      this.moduleService.create(module).subscribe(
        data => {
          if (data.status === 201) {
            this.message('Модуль создан', false);
            this.router.navigate(['admin/modules']);
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

  delete(module: Module): void {
    this.modules = this.modules.filter(m => m !== module);
    this.moduleService.delete(module).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Модуль удален', false);
          //  this.router.navigate(['admin/companies']);
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
