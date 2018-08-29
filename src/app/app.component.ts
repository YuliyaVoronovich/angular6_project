import {Component, OnInit} from '@angular/core';
import {SharedService} from './_services/shared.service';
import {trigger, state, style, transition, animate, keyframes} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  state: any = 'hide';
  textMessage: any;
  errorMessage: boolean;

  constructor(private sharedService: SharedService) {
    this.errorMessage = false;

    sharedService.changeEmitted$1.subscribe(text => {
      // console.log(text);
      this.textMessage = text[1];
      this.errorMessage = text[2];
      this.state = (this.state === 'hide' ? 'show' : 'hide');
      this.state = text[0];
    });
  }

}




