import {User} from './User.model';
import {Company} from './Company.model';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class ClientHouse {

  constructor(
    public id: number,
    public user: User,
    public company: Company,
    public regions: any,
    public array_regions: any [] = [],
    public districts_country: any,
    public array_districts_country: any [] = [],
    public cities: any,
    public array_cities: any [] = [],
    public districts: any,
    public array_districts: any [] = [],
    public directions: any,
    public array_directions: any [] = [],
    public phone1: string,
    public phone2: string,
    public surname: string,
    public name: string,
    public patronymic: string,
    public price: number,
    public mcad: number,
    public area_land_from: number,
    public area_land_to: number,
    public area_build_from: number,
    public area_build_to: number,
    public area_from: number,
    public area_to: number,
    public area_leave_from: number,
    public area_leave_to: number,
    public area_kitchen_from: number,
    public area_kitchen_to: number,
    public types: any[] = [],
    public walls: any[] = [],
    public roofs: any[] = [],
    public sewage: boolean,
    public heating: any[] = [],
    public water: any[] = [],
    public gas: boolean,
    public electricity: boolean,
    public description: string,
    public source: number,
    public contract: string,
    public contract_fraction: string,
    public contract_from: NgbDateStruct,
    public contract_to: NgbDateStruct,
    public delete_at: boolean,
    public created_at: Date,
    public updated_at: Date

  ) {}
}
