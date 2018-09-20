import {Company} from './company.model';

export class CompanyHistoryBlock {


  constructor(

    public id: number,
    public company_id: Company,
    public status: number,
    public description: string,
    public created_at: Date,
    public updated_at: Date
  ) {}
}
