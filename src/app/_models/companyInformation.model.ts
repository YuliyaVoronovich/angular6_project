import {Company} from './company.model';

export class CompanyInformation {


  constructor(

  public id: number,
  public company_id: Company,
  public id_domovita: string,
  public login_onliner: string,
  public pass_onliner: string,
  public login_realt: string,
  public pass_realt: string,
  ) {}
}
