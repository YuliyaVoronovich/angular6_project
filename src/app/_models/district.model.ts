import {City} from './city.model';

export class District {

  constructor(
    public id: number,
    public city: City,
    public title: string,
    public coordinates: string,
  ) {}
}
