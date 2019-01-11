import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Http, Response} from '@angular/http';
import {Globals} from '../globals';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  private uri = '/curs';

  public curs_usd: number;
  public price_byn: number;
  public price_usd: number;
  public percent;
  public service_cost_byn: number;
  public service_cost_usd: number;
  public amount_base_value: number;
  public amount_base_value_service_cost: number;

  constructor(
    private http: Http,
    private globals: Globals,
    public dialogRef: MatDialogRef<CalculatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.price_usd = data.price;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getCurs();
  }

  calculate() {
    console.log(this.price_usd);
    this.price_byn = +this.curs_usd * +this.price_usd;

    this.amount_base_value = Math.floor(+this.price_byn / +this.globals.base_value);

    if (this.amount_base_value > 0 && this.amount_base_value <= 4200) {
      this.percent = 3;
    }
    if (this.amount_base_value > 4200 && this.amount_base_value <= 5000) {
      this.percent = 2.5;
    }
    if (this.amount_base_value > 5000 && this.amount_base_value <= 5800) {
      this.percent = 2.4;
    }
    if (this.amount_base_value > 5800 && this.amount_base_value <= 6600) {
      this.percent = 2.3;
    }
    if (this.amount_base_value > 6600 && this.amount_base_value <= 7500) {
      this.percent = 2.2;
    }
    if (this.amount_base_value > 7500 && this.amount_base_value <= 8300) {
      this.percent = 2.1;
    }
    if (this.amount_base_value > 8300 && this.amount_base_value <= 9100) {
      this.percent = 2.0;
    }
    if (this.amount_base_value > 9100 && this.amount_base_value <= 10000) {
      this.percent = 1.9;
    }
    if (this.amount_base_value > 10000 && this.amount_base_value <= 10500) {
      this.percent = 1.8;
    }
    if (this.amount_base_value > 10500 && this.amount_base_value <= 11600) {
      this.percent = 1.7;
    }
    if (this.amount_base_value > 11600 && this.amount_base_value <= 12400) {
      this.percent = 1.6;
    }
    if (this.amount_base_value > 12400 && this.amount_base_value <= 13200) {
      this.percent = 1.5;
    }
    if (this.amount_base_value > 13200 && this.amount_base_value <= 14000) {
      this.percent = 1.4;
    }
    if (this.amount_base_value > 14000 && this.amount_base_value <= 14900) {
      this.percent = 1.3;
    }
    if (this.amount_base_value > 14900 && this.amount_base_value <= 15700) {
      this.percent = 1.2;
    }
    if (this.amount_base_value > 15700 && this.amount_base_value <= 16500) {
      this.percent = 1.1;
    }
    if (this.amount_base_value > 16500) {
      this.percent = 1.0;
    }

    this.service_cost_byn = (+this.percent * +this.price_byn) / 100;
    this.service_cost_usd = (+this.percent * +this.price_usd) / 100;

    this.amount_base_value_service_cost = Math.floor(+this.service_cost_byn / +this.globals.base_value);

  }

  getCurs(): any {
    return this.http.get(this.globals.url + this.uri)
      .map((response: Response) => response.json().curs_usd)
      .subscribe(res => {
          this.curs_usd = res;
          console.log(this.curs_usd);
          // рассчет стоимостей
          this.calculate();
        }
      );
  }
}
