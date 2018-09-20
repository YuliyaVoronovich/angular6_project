import {Component, Input, OnInit} from '@angular/core';
import {Sale} from '../../_models/sale.model';
import {LocationService} from '../../_services/location.service';
import {IOption} from 'ng-select';

@Component({
  selector: 'app-sale-reguest-location',
  templateUrl: './sale-reguest-location.component.html',
  styleUrls: ['./sale-reguest-location.component.css']
})
export class SaleReguestLocationComponent implements OnInit {

  @Input() sale;

  public regions: Array<IOption> = [
    {label: '', value: ''}
  ];

  public cities: Array<IOption> = [
    {label: '', value: ''}
  ];

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.getRegions();
    this.getCities();

    this.sale.location = this.locationService.setLocation(this.sale.location);
    this.sale.location.city = this.locationService.setCity(this.sale.location);
    this.sale.location.city.district_country = this.locationService.setDistrictCountry(this.sale.location);
    this.sale.location.city.district_country.region = this.locationService.setRegion(this.sale.location);
    this.sale.location.district = this.locationService.setDistrict(this.sale.location);
    this.sale.location.microdistrict = this.locationService.setMicroDistrict(this.sale.location);
    this.sale.location.street = this.locationService.setStreet(this.sale.location);

    console.log(this.sale);
  }
  getRegions() {
    this.locationService.getRegions().subscribe((options) => {
      this.regions = [];
      for (let i = 0; i < options.length; i++) {
        this.regions.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  getCities(region = 0) {
    this.locationService.getCities(region).subscribe((options) => {
      this.cities = [];
      for (let i = 0; i < options.length; i++) {
        this.cities.push({label: options[i].title, value: '' + options[i].id});
      }
    });
  }

  sendRequest() {
    console.log(this.sale);
   // console.log(this.sale);

  }

}
