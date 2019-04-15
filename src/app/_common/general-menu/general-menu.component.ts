import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AccessModel} from '../../_models/Access.model';
import {Subscription} from 'rxjs';
import {SharedService} from '../../_services/shared.service';
import {SaleService} from '../../_services/sale.service';
import {HouseService} from '../../_services/house.service';
import {User} from '../../_models/User.model';

@Component({
  selector: 'app-general-menu',
  templateUrl: './general-menu.component.html',
  styleUrls: ['./general-menu.component.css']
})
export class GeneralMenuComponent implements OnInit {

  public path = 'sales';
  public subscription: Subscription;
  public count_moderation_sale;
  public count_delete_sale;
  public count_moderation_house;
  public count_delete_house;

  public search = {
    'company': 0
  };

  public user: User = new User(0, '', '', null, null, null, '', 0,
    null, null, false, null, null, '', null, null, null);

    public access: AccessModel = new AccessModel(false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private sharedService: SharedService,
              private saleService: SaleService,
              private houseService: HouseService) {

    this.subscription = sharedService.changeEmitted$4.subscribe(data => {
      this.getSalesModerationCount();
      this.getSalesDeleteCount();
      this.getHousesModerationCount();
      this.getHousesDeleteCount();
    });
  }

  ngOnInit() {
    this.route.url.subscribe(
      url => {
        this.path = url[0]['path'];
      });

    this.loginService.detailsUser().subscribe(data => {
      this.access = data.array_access;
      this.user = data.user;

      this.getSalesModerationCount();
      this.getSalesDeleteCount();
      this.getHousesModerationCount();
      this.getHousesDeleteCount();
    });
  }

  getSalesModerationCount () {
    this.search['company'] = this.user.company.id;

    this.saleService.countSalesModeration(this.search).subscribe(data => {
      this.count_moderation_sale = data.count;
    });
  }

  getSalesDeleteCount () {
    this.search['company'] = this.user.company.id;

    this.saleService.countSalesDelete(this.search).subscribe(data => {
      this.count_delete_sale = data.count;
    });
  }

  getHousesModerationCount () {
    this.search['company'] = this.user.company.id;

    this.houseService.countHousesModeration(this.search).subscribe(data => {
      this.count_moderation_house = data.count;
    });
  }

  getHousesDeleteCount () {
    this.search['company'] = this.user.company.id;

    this.houseService.countHousesDelete(this.search).subscribe(data => {
      this.count_delete_house = data.count;
    });
  }
}
