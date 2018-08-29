import {DistrictCountry} from './district_country.model';

export class City {

  constructor(
    public id: number,
    public district_country: DistrictCountry,
    public title: string,
  ) {}
}
