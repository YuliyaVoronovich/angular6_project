import {User} from './User.model';
import {Company} from './Company.model';
import {City} from './City.model';
import {CallSale} from './CallSale.model';

export class Client {

  constructor(
    public id: number,
    public user: User,
    public company: Company,
    public call: CallSale,
    public city: City,
    public districts: any,
    public array_districts: any [] = [],
    public microdistricts: any,
    public array_microdistricts: any [] = [],
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
    public types_house: any[] = [],
    public repairs: any[] = [],
    public contract: string,
    public contract_fraction: string,
    public contract_from: any,
    public contract_to: any,
    public send: boolean,
    public delete_at: boolean,
    public created_at: Date,
    public updated_at: Date,
    public access_edit: boolean,
    public access_delete: boolean,
    public access_own_info: boolean
  ) {
  }
}
