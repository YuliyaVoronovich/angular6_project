import {City} from './City.model';

export class Street {

  constructor(
    public id: number,
    public title: string,
    public city: City
  ) {}
}
