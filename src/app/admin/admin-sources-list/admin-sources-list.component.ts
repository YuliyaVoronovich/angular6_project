import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {SharedService} from '../../_services/shared.service';
import {Source} from '../../_models/Source.model';
import {Router} from '@angular/router';
import {SourceService} from '../../_services/source.service';

@Component({
  selector: 'app-admin-sourses-list',
  templateUrl: './admin-sources-list.component.html',
  styleUrls: ['./admin-sources-list.component.css']
})
export class AdminSourcesListComponent implements OnInit {

  public sources: Source[] = [];
  public source: Source = new Source(0, '', 0);
  public editRowId: any;
  public timer: any;

  public hide = false;

  @ViewChild('myInput') inputEl: ElementRef;

  constructor(private router: Router,
              private sourceService: SourceService,
              private loginService: LoginService,
              private sharedService: SharedService) {

  }

  ngOnInit() {
    this.getSources();
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

  change(source: Source) {
    this.save(source);
    this.editRowId = 0;
  }

  addSource(title) {
    if (title.length > 0) {

    }
  }

  getSources() {
    this.sources = [];

    return this.sourceService.getSources().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.sources.push(data[i]);
        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
      });
  }
  save(source: Source) {
    console.log(source);

    if (source.id !== 0) {
      this.sourceService.update(source).subscribe(
        data => {
          if (data.status === 200) {
            this.message('Источник обновлен', false);
            this.router.navigate(['admin/sources']);
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
      this.sourceService.create(source).subscribe(
        data => {
          if (data.status === 201) {
            this.message('Источник создан', false);
            this.getSources();
            this.hide = false;
            this.source.title = '';
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

  delete(source: Source): void {
    this.sources = this.sources.filter(m => m !== source);
    this.sourceService.delete(source).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Источник удален', false);
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
