import {Component, OnInit} from '@angular/core';
import {LocationService} from '../../_services/location.service';
import {Globals} from '../../_common/globals';
import {Http, Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {LabelService} from '../../_services/label.service';
import {CompanyService} from '../../_services/company.service';
import {HouseService} from '../../_services/house.service';
import {UserInformation} from '../../_models/UserInformation.model';
import {NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';
import {User} from '../../_models/User.model';
import {House} from '../../_models/House.model';

@Component({
  selector: 'app-house-show',
  templateUrl: './house-show.component.html',
  styleUrls: ['./house-show.component.css']
})
export class HouseShowComponent implements OnInit {

  public archive = false;

  public house: House = new House(0, null, null, '', '', '', '', '', false,
    '', false, '', 0, 0, false, null, null, false, 0, null,
    null, '', '', 0, null, 0, 0, 0, 0, 0, 0, 0, 0, null, 0,
    false, false, false, '', 0, 0, 0, 0, 0, 0, false, '', '',
    '', [], false, false, false, null, null, null, [],
    false, false, false, false);

  public user: User = new User(0, '', '', null, null, null, '',
    0, 0, 0, false, null, null, null, null, null, null);
  public user_information: UserInformation = new UserInformation(0, '', '', '', '', '', '', null, []);

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  private uri = '/curs';

  public curs_usd: number;
  public curs_euro: number;
  public price_byn: number;
  public price_euro: number;

  public heating: string;
  public water: string;
  public gas: string;
  public electricity: string;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private houseService: HouseService,
              private locationService: LocationService,
              private labelService: LabelService,
              private userService: UserService,
              private companyService: CompanyService,
              private http: Http,
              private globals: Globals) {
  }

  ngOnInit() {

    this.galleryOptions = [
      {
        width: '100%',
        height: '100%',
        imagePercent: 100,
        thumbnailsPercent: 20,
        thumbnailsColumns: 6,
        thumbnailsMargin: 2,
        thumbnailMargin: 2
      },
      {'breakpoint': 500, 'width': '100%', 'height': '100%', 'thumbnailsColumns': 3},
      {'breakpoint': 300, 'width': '100%', 'height': '100%', 'thumbnailsColumns': 2}
    ];

    this.route.params.subscribe(
      params => {

        if (params['id']) {

          this.route.data.subscribe(({data}) => {

            this.house = data.house;

            this.house.house_addition_information = this.houseService.setHouseAdditionInformation(this.house.house_addition_information);

            this.house.company = this.companyService.setCompany(this.house.company);
            this.house.company.company_information = this.companyService.setCompanyInformation(this.house.company.company_information);
            this.house.user = this.userService.setUser(this.house.user);
            this.house.user.user_information = this.userService.setUserInformation(this.house.user.user_information);
            this.house.user.manager_information = this.userService.setUserInformation(this.house.user.user_information);

            // телефоны с логотипами
            if (this.house.company.company_information.phone_house_general_1) {
              this.house.company.company_information.phone_house_general_1 = this.globals.transformPhone(this.house.company.company_information.phone_house_general_1);
            }

            if (this.house.company.company_information.phone_house_general_2) {
              this.house.company.company_information.phone_house_general_2 = this.globals.transformPhone(this.house.company.company_information.phone_house_general_2);
            }
            if (this.house.company.company_information.phone_house_general_3) {
              this.house.company.company_information.phone_house_general_3 = this.globals.transformPhone(this.house.company.company_information.phone_house_general_3);
            }

            if (this.house.company.company_information.phone_house_general_4) {
              this.house.company.company_information.phone_house_general_4 = this.globals.transformPhone(this.house.company.company_information.phone_house_general_4);
            }

            if (this.house.user.user_information.phone1) {
              this.house.user.user_information.phone1 = this.globals.transformPhone(this.house.user.user_information.phone1);
            }
            if (this.house.user.user_information.phone2) {
              this.house.user.user_information.phone2 = this.globals.transformPhone(this.house.user.user_information.phone2);
            }

            this.house.location = this.locationService.setLocation(this.house.location);
            this.house.location.city = this.locationService.setCity(this.house.location.city);
            this.house.location.city.district_country = this.locationService.setDistrictCountry(this.house.location.city.district_country);
            this.house.location.city.district_country.region = this.locationService.setRegion(this.house.location.city.district_country.region);
            this.house.location.district = this.locationService.setDistrict(this.house.location.district);
            this.house.location.microdistrict = this.locationService.setMicroDistrict(this.house.location.microdistrict);
            this.house.location.street = this.locationService.setStreet(this.house.location.street);

            this.house.type = this.labelService.setTypeHouse(this.house.type);
            this.house.type.title = this.ucFirst(this.house.type.title);

            this.house.heating = this.labelService.setHeatingHouse(this.house.heating);
            this.house.water = this.labelService.setWaterHouse(this.house.water);
            this.house.gas = this.labelService.setGasHouse(this.house.gas);
            this.house.electricity = this.labelService.setElectricityHouse(this.house.electricity);

            console.log(this.house);

            // список характеристик
             if (this.house.heating.id > 0) {
               this.heating = 'Отопление: ' + this.house.heating.title;
             }
            if (this.house.water.id > 0) {
              this.water = 'Вода: ' + this.house.water.title;
            }
            if (this.house.gas.id > 0) {
              this.gas = 'Газ: ' + this.house.gas.title;
            }
            if (this.house.electricity.id > 0) {
              this.electricity = 'Электричество: ' + this.house.electricity.title;
            }

            for (let i = 0; i < this.house.photo.length; i++) {
              this.galleryImages.push({
                small: this.house.photo[i].mini,
                medium: this.house.photo[i].midi,
                big: this.house.photo[i].path
              });
            }
            this.getCurs(this.house.price);

          });
        } else {
          this.archive = true;
        }
      });
  }

  ucFirst(str): string {
    // только пустая строка в логическом контексте даст false
    if (!str) return str;

    return str[0].toUpperCase() + str.slice(1);
  }

  getCurs(price): any {
    return this.http.get(this.globals.url + this.uri)
      .map((response: Response) => response.json())
      .subscribe(res => {
          this.curs_usd = res.curs_usd;
          this.curs_euro = res.curs_euro;

          this.price_byn = Math.floor(price * this.curs_usd);
          this.price_euro = Math.floor(price * this.curs_usd / this.curs_euro);
        }
      );
  }

}
