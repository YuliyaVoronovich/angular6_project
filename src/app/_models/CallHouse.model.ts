import {User} from './User.model';
import {Label} from './Label.model';
import {House} from './House.model';
import {Company} from './Company.model';

export class CallHouse {

  constructor(
    public id: number,
    public house: House,
    public user: User,
    public company: Company,
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
