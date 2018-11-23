import {City} from './City.model';

export class District {

  constructor(
    public id: number,
    public city: City,
    public title: string,
    public small_title: string,
    public coordinates: string,
  ) {}
}
