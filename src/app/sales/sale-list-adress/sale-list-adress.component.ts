import {Component, Input, OnInit} from '@angular/core';
import {Location} from '../../_models/location.model';
import {LocationService} from '../../_services/location.service';

@Component({
  selector: 'app-sale-list-adress',
  templateUrl: './sale-list-adress.component.html',
  styleUrls: ['./sale-list-adress.component.css']
})
export class SaleListAdressComponent implements OnInit {

  @Input() location: Location;

  address = '';

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    this.location = this.locationService.setLocation(this.location);
    this.location.city = this.locationService.setCity(this.location);
    this.location.district = this.locationService.setDistrict(this.location);
    this.location.microdistrict = this.locationService.setMicroDistrict(this.location);
    this.location.street = this.locationService.setStreet(this.location);
    this.location.metro = this.locationService.setMetro(this.location);

    /*if (this.location.city.title && this.location.city.title !== 'Минск') {
      this.address = this.location.city.title + ', ';
    }*/
    if (this.location.street.title) {
      this.address += this.location.street.title + ', ';
    }
    this.address += this.location.house;
    if (this.location.housing !== '0') {
      this.address += '/' + this.location.housing;
    }
    /*if (this.location.district.title) {
      this.address += '<br/>' + ' (' + this.location.district.title + ')';
    }*/

  }

}
