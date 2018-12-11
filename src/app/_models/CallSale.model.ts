import {Sale} from './Sale.model';
import {User} from './User.model';
import {Label} from './Label.model';

export class CallSale {

  constructor(
    public id: number,
    public sale: Sale,
    public user: User,
    public phone: string,
    public source: Label,
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
