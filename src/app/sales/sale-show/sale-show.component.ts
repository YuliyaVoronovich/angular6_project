import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../_services/user.service';
import {LocationService} from '../../_services/location.service';
import {LabelService} from '../../_services/label.service';
import {SaleService} from '../../_services/sale.service';
import {User} from '../../_models/User.model';
import {Sale} from '../../_models/Sale.model';
import {UserInformation} from '../../_models/UserInformation.model';
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation} from 'ngx-gallery';
import {CompanyService} from '../../_services/company.service';
import {Http, Response} from '@angular/http';
import {Globals} from '../../_common/globals';

@Component({
  selector: 'app-sale-show',
  templateUrl: './sale-show.component.html',
  styleUrls: ['./sale-show.component.css']
})
export class SaleShowComponent implements OnInit {

  public sale: Sale = new Sale(0, null, null, '', '', '', 0, 0, false,
    '', false, false, false, '', '', null, null, false, '', null,
    '', 0, 0, 0, 0, 0, 0, '', 0, 0, 0, false, false, false, 0,
    0, 0, 0, 0, '', 0, false, '', '', false, 0, 0, null,
    null, null, null, false, false, false, null, null, null,
    null, false, false, false, false);

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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private saleService: SaleService,
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
        thumbnailsMargin: 0,
        thumbnailMargin: 0
      },
      {'breakpoint': 500, 'width': '300px', 'height': '300px', 'thumbnailsColumns': 3},
      {'breakpoint': 300, 'width': '100%', 'height': '200px', 'thumbnailsColumns': 2}
    ];

    this.route.params.subscribe(
      params => {

        if (params['id']) {
          this.saleService.getSale(params['id']).subscribe(data => {
            this.sale = data.sale;

            for (let i = 0; i < this.sale.photo_reclame.length; i++) {
              this.galleryImages.push({
                small: this.sale.photo_reclame[i].mini,
                medium: this.sale.photo_reclame[i].midi,
                big: this.sale.photo_reclame[i].path
              });
            }

            this.getCurs(this.sale.price);

          });
        }

        this.sale.sale_addition_information = this.saleService.setSaleAdditionInformation(this.sale.sale_addition_information);

        this.sale.user = this.userService.setUser(this.sale.user);
        this.sale.user.user_information = this.userService.setUserInformation(this.sale.user.user_information);
        this.sale.user.manager_information = this.userService.setUserInformation(this.sale.user.user_information);

        this.sale.company = this.companyService.setCompany(this.sale.company);
        this.sale.company.company_information = this.companyService.setCompanyInformation(this.sale.company.company_information);

        this.sale.location = this.locationService.setLocation(this.sale.location);
        this.sale.location.city = this.locationService.setCity(this.sale.location.city);
        this.sale.location.city.district_country = this.locationService.setDistrictCountry(this.sale.location.city.district_country);
        this.sale.location.city.district_country.region = this.locationService.setRegion(this.sale.location.city.district_country.region);
        this.sale.location.district = this.locationService.setDistrict(this.sale.location.district);
        this.sale.location.microdistrict = this.locationService.setMicroDistrict(this.sale.location.microdistrict);
        this.sale.location.street = this.locationService.setStreet(this.sale.location.street);
        this.sale.location.metro = this.locationService.setMetro(this.sale.location.metro);
        this.sale.location.wall = this.labelService.setWall(this.sale.location.wall);
        this.sale.location.type_house = this.labelService.setTypeHouse(this.sale.location.type_house);
      });
  }

  getCurs(price): any {
    return this.http.get(this.globals.url + this.uri)
      .map((response: Response) => response.json())
      .subscribe(res => {
          this.curs_usd = res.curs_usd;
          this.curs_euro = res.curs_euro;

          this.price_byn =  Math.floor(price * this.curs_usd);
          this.price_euro =  Math.floor(price * this.curs_usd / this.curs_euro);
        }
      );
  }

}
