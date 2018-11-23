import {Region} from './Region.model';

export class DistrictCountry {

  constructor(
    public id: number,
    public region: Region,
    public title: string,
  ) {}
}
