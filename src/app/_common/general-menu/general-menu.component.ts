import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../_services/login.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-general-menu',
  templateUrl: './general-menu.component.html',
  styleUrls: ['./general-menu.component.css']
})
export class GeneralMenuComponent implements OnInit {

  public path = 'sales';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService) {
  }

  ngOnInit() {
    this.route.url.subscribe(
      url => {
        this.path = url[0]['path'];
      });
  }
}
