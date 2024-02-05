import {User} from './User.model';
import {House} from './House.model';
import {Company} from './Company.model';
import {Source} from './Source.model';

export class CallHouse {

  constructor(
    public id: number,
    public house: House,
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
