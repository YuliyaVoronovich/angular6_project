import {Component, Input, OnInit} from '@angular/core';
import {RequestService} from '../../_services/request.service';
import {Request} from '../../_models/request.model';

@Component({
  selector: 'app-admin-request-location',
  templateUrl: './admin-request-location.component.html',
  styleUrls: ['./admin-request-location.component.css']
})
export class AdminRequestLocationComponent implements OnInit {

  @Input() location: any;

  public requests: Request [] = [];

  public regions = [];
  public districts = [];
  public cities = [];
  public streets = [];

  public search = {
    'section': '1'
  };

  constructor(private requestService: RequestService) {
  }

  ngOnInit() {

    this.regions = this.location[0];
    this.cities = this.location[1];
    this.streets = this.location[2];

    this.getRequests();
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

  getRequests() {
    this.requestService.getRequests(this.search).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].info.region = this.findRegion(data[i].info.region);
        data[i].info.city = this.findCity(data[i].info.city);
       // data[i].info.district_country = this.findCity(data[i].info.district_country);

        this.requests.push(data[i]);
      }
    });
  }
}
