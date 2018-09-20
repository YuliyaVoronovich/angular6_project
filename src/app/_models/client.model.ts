import {User} from './user.model';

export class Client {


  constructor(
    public id: number,
    public user: User
  ) {}
}
