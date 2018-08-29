import {Region} from './region.model';

export class DistrictCountry {

  constructor(
    public id: number,
    public region: Region,
    public title: string,
  ) {}
}
