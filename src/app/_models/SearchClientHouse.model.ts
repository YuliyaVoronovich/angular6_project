import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class SearchClientHouseModel {

  constructor(
    public regions: any,
    public districts_country: any,
    public cities: any,
    public districts: any,
    public directions: any,
    public price: string,
    public types: any,
    public mcad: number,
    public created_from: NgbDateStruct,
    public created_to: NgbDateStruct,
    public updated_from: NgbDateStruct,
    public updated_to: NgbDateStruct,
    public partner: boolean
  ) {}
}
