import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AccessModel} from '../../_models/Access.model';
import {Subscription} from 'rxjs';
import {SharedService} from '../../_services/shared.service';
import {SaleService} from '../../_services/sale.service';
import {HouseService} from '../../_services/house.service';

@Component({
  selector: 'app-general-menu',
  templateUrl: './general-menu.component.html',
  styleUrls: ['./general-menu.component.css']
})
export class GeneralMenuComponent implements OnInit {

  public path = 'sales';
  public subscription: Subscription;

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
    });
  }

  ngOnInit() {
    this.route.url.subscribe(
      url => {
        this.path = url[0]['path'];
      });

    this.loginService.detailsUser().subscribe(data => {
      this.access = data.array_access;
    });
  }
  getSalesModerationCount () {

  }
}
