import {DistrictCountry} from './districtCountry.model';

export class City {

  constructor(
    public id: number,
    public district_country: DistrictCountry,
    public title: string,
  ) {}
}
