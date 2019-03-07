import {City} from './City.model';
import {District} from './District.model';
import {Microdistrict} from './Microdistrict.model';
import {Street} from './Street.model';
import {Metro} from './Metro.model';
import {Region} from './Region.model';
import {DistrictCountry} from './DistrictCountry.model';
import {Direction} from './Direction.model';
import {Label} from './Label.model';

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
    public wall: Label,
    public type_house: Label,
    public year: number,
    public year_repair: number,
    public direction: Direction,
    public coordinates: string
  ) {}
}
