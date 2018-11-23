import {CompanyInformation} from './CompanyInformation.model';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {User} from './User.model';
import {CompanyHistoryBlock} from './CompanyHistoryBlock.model';

export class Company {

  constructor(
    public id: number,
    public title: string,
    public name_organization: string,
    public ynp: string,
    public license: string,
    public license_issued: string,
    public license_from: NgbDateStruct,
    public license_to: NgbDateStruct,
    public fio_director: string,
    public phone_director: string,
    public prefix: string,
    public created_at: Date,
    public updated_at: Date,
    public company_information: CompanyInformation,
    public modules: any[] = [],
    public user: User,
    public disable: boolean,
    public company_history_blocks: CompanyHistoryBlock
  ) {
  }
}
