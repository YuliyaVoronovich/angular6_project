import {Company} from './Company.model';
import {User} from './User.model';
import {HouseAdditionInformation} from './HouseAdditionInformation.model';
import {Photo} from './Photo.model';
import {Location} from './Location.model';
import {Label} from './Label.model';

export class House {

  constructor(
    public id: number,
    public user: User,
    public company: Company,
    public cont_phone1: string,
    public cont_phone2: string,
    public fio: string,
    public contract: string,
    public contract_fraction: string,
    public contract_from: any,
    public contract_to: any,
    public request: boolean,
    public request_number: string,
    public price: number,
    public price_sqr: number,
    public auction: boolean,
    public credit: boolean,
    public execution: boolean,
    public quickly: boolean,
    public sale: number,
    public exchange: string,
    public location: Location,
    public mcad: string,
    public landmark: string,
    public storeys: number,
    public type: Label,
    public room: number,
    public room_separate: number,
    public area_land: number,
    public area_build: number,
    public area: number,
    public area_leave: number,
    public area_kitchen: number,
    public wall: number,
    public roof: Label,
    public year: number,
    public elite: boolean,
    public new_building: boolean,
    public unfinished: boolean,
    public percent: string,
    public sewage: number,
    public repair: number,
    public heating: number,
    public water: number,
    public gas: number,
    public electricity: number,
    public send: boolean,
    public text: string,
    public title: string,
    public comment: string,
    public photo: Photo [],
    public moderation: boolean,
    public delete_moderation: boolean,
    public delete_at: boolean,
    public created_at: Date,
    public updated_at: Date,
    public house_addition_information: HouseAdditionInformation,
    public streetRequest: string,
    public access_edit: boolean,
    public access_delete: boolean,
    public access_own_info: boolean,
    public access_reclame: boolean
  ) {

  }
}
