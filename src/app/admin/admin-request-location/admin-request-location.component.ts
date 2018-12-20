import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {RequestService} from '../../_services/request.service';
import {Request} from '../../_models/Request.model';
import {SharedService} from '../../_services/shared.service';
import {Router} from '@angular/router';
import {LoginService} from '../../_services/login.service';

@Component({
  selector: 'app-admin-request-location',
  templateUrl: './admin-request-location.component.html',
  styleUrls: ['./admin-request-location.component.css']
})
export class AdminRequestLocationComponent implements OnInit, OnChanges {

  @Input() location: any;
  @Input() deleteRequest: boolean;
  @Input() request;

  @Output() changed = new EventEmitter();

  public requests: Request [] = [];

  public regions = [];
  public districts = [];
  public cities = [];
  public streets = [];

  public timer: any;

  public search = {
    'section': '1'
  };

  constructor(private requestService: RequestService,
              private sharedService: SharedService,
              private route: Router,
              private loginService: LoginService) {
  }

  ngOnInit() {

    this.regions = this.location[0];
    this.cities = this.location[1];
    this.streets = this.location[2];

    this.getRequests();
  }


  ngOnChanges(changes: { [propName: string]: SimpleChange }) {

    console.log (this.deleteRequest);

    if (this.deleteRequest === true) {
     // if (changes['param'].previousValue !== changes['param'].currentValue) {
        this.delete(this.request);
    //  }
    }
  }

  message(mes: string, error: boolean) {
    let arr: any[] = ['show', mes, error];
    this.sharedService.emitChange(arr);
    arr = ['hide', '', false];
    this.timer = setTimeout(() => {
      this.sharedService.emitChange(arr);
    }, 3000);
  }

  findRegion(id) {
    return this.regions.find(x => x.id === +id).title;
  }

  findCity(id) {
    return this.cities.find(x => x.id === +id).title;
  }

  findDistrict(id) {
    return this.districts.find(x => x.id === +id).title;
  }
  findStreet(id) {
    return this.streets.find(x => x.id === +id).title;
  }

  getRequests() {

    this.requests = [];
    this.requestService.getRequests(this.search).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].info.region) {
          data[i].info.region = this.findRegion(data[i].info.region);
        }
        if (data[i].info.city) {
          data[i].info.city = this.findCity(data[i].info.city);
        }
        if (data[i].info.street && +data[i].info.street) {
          data[i].info.street = this.findStreet(data[i].info.street);
        }
       // data[i].info.district_country = this.findCity(data[i].info.district_country);

        this.requests.push(data[i]);
      }
    });
  }
  choose(request: Request) {
    this.requestService.getRequest(request).subscribe(data => {
        this.changed.emit(data.request);
    },
      error => {
        if (error.status === 401) {
          this.route.navigate(['']);
        }
        if (error.status === 404) {
          this.route.navigate(['404']);
        }
        if (error.status === 403) {
          this.route.navigate(['403']);
        }
      });
  }

  delete(request: Request): void {

    this.requestService.deleteRequest(request).subscribe(
      data => {
        if (data.status === 200) {
          this.message('Заявка удалена', false);
          // this.requests = this.requests.filter(r => r !== request);
          this.getRequests();

        }
      },
      error => {
        if (error.status === 401) {
          this.loginService.logout();
          this.route.navigate(['/']);
        }
      }
    );
  }
}
