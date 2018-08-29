import {City} from './city.model';
import {District} from './district.model';
import {Microdistrict} from './microdistrict.model';
import {Street} from './street.model';
import {Metro} from './metro.model';
import {Region} from './region.model';
import {DistrictCountry} from './district_country.model';

export class Location {

  constructor(
    public id: number,
    public region: Region,
    public district_country: DistrictCountry,
    public city: City,
    public district: District,
    public microdistrict: Microdistrict,
    public street: Street,
    public house: string,
    public housing: string,
    public metro: Metro,
    public series: string,
    public wall: number,
    public type_house: number,
    public year: number,
    public year_repair: number,
    public coordinates: string
  ) {}
}
