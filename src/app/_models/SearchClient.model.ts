import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class SearchClientModel {

  constructor(
    public regions: any,
    public districts_country: any,
    public cities: any,
    public districts: any,
    public room: any,
    public price: string,
    public created_from: NgbDateStruct,
    public created_to: NgbDateStruct,
    public updated_from: NgbDateStruct,
    public updated_to: NgbDateStruct,
    public partner: boolean
  ) {}
}
