import {User} from './user.model';
import {Company} from './company.model';
import {Label} from './label.model';
import {Microdistrict} from './microdistrict.model';
import {DistrictCountry} from './districtCountry.model';
import {City} from './city.model';
import {District} from './district.model';
import {Region} from './region.model';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class Client {

  constructor(
    public id: number,
    public user: User,
    public company: Company,
    public region: Region,
    public district_country: DistrictCountry,
    public city: City,
    public districts: any[] = [],
    public microdistricts: any[] = [],
    public metro: any[] = [],
    public phone1: string,
    public phone2: string,
    public surname: string,
    public name: string,
    public patronymic: string,
    public price: number,
    public room_from: number,
    public room_to: number,
    public area_from: number,
    public area_to: number,
    public area_leave_from: number,
    public area_leave_to: number,
    public area_kitchen_from: number,
    public area_kitchen_to: number,
    public storey_from: number,
    public storey_to: number,
    public storeys_from: number,
    public storeys_to: number,
    public wc: number,
    public balcony: boolean,
    public year: number,
    public big_repair: boolean,
    public no_first: boolean,
    public no_last: boolean,
    public first_hight: boolean,
    public last_storey: boolean,
    public description: string,
    public source: number,
    public walls: any[] = [],
    public type_house: any[] = [],
    public repair: any[] = [],
    public contract: string,
    public contract_from: NgbDateStruct,
    public contract_to: NgbDateStruct,
    public delete_at: boolean,
    public created_at: Date,
    public updated_at: Date

  ) {}
}
