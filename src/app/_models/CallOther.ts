import {User} from './User.model';
import {Company} from './Company.model';


export class CallOther {

  constructor(
    public id: number,
    public user: User,
    public company: Company,
    public phone: string,
    public description: string,
    public uid: string,
    public uid2: string,
    public duration: string,
    public ready: number,
    public created_at: Date,
    public updated_at: Date
  ) {
  }
}
