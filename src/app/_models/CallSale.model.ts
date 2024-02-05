import {Sale} from './Sale.model';
import {User} from './User.model';
import {Company} from './Company.model';
import {Source} from './Source.model';

export class CallSale {

  constructor(
    public id: number,
    public sale: Sale,
    public user: User,
    public company: Company,
    public phone: string,
    public source: Source,
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
