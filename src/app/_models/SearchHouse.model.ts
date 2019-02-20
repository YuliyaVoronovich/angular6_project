import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class SearchHouseModel {

  constructor(
    public region: any,
    public district_rb: any,
    public city: any,
    public district: any,
    public street: any,
    public direction: any,
    public mcad: string,
    public created_from: NgbDateStruct,
    public created_to: NgbDateStruct,
    public updated_from: NgbDateStruct,
    public updated_to: NgbDateStruct,
    public price_from: string,
    public price_to: string,
    public area_land_from: string,
    public area_land_to: string,
    public area_build_from: string,
    public area_build_to: string,
    public area_from: string,
    public area_to: string,
    public area_leave_from: string,
    public area_leave_to: string,
    public walls: any,
    public roofs: any,
    public sewage: any,
    public sales: any,
    public company: string,
    public year: string,
    public repairs: any,
    public heating: any,
    public water: any,
    public types: any,
    public terrace: any,
    public furniture: any,
    public gas: any,
    public electricity: any,
    public new_building: any,
    public finished: any,
    public partner: boolean
  ) {
  }
}
