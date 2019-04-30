import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class SearchCallModel {

  constructor(
    public regions: any,
    public districts_country: any,
    public cities: any,
    public streets: any,
    public room: any,
    public price: string,
    public created_from: NgbDateStruct,
    public created_to: NgbDateStruct,
    public updated_from: NgbDateStruct,
    public updated_to: NgbDateStruct,
    public users: string,
    public company: number
  ) {}
}
