import {Location} from './location.model';
import {User} from './user.model';
import {SaleAdditionInformation} from './saleAdditionInformation.model';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Count} from './count.model';
import {Photo} from './photo.model';

export class Sale {


  constructor(

    public id: number,
    public user: User,
    public cont_phone1: string,
    public cont_phone2: string,
    public fio: string,
    public price: number,
    public price_sqr: number,
    public auction: boolean,
    public exchange: string,
    public credit: boolean,
    public execution: boolean,
    public quickly: boolean,
    public dogovor: string,
    public dogovor_from: NgbDateStruct,
    public dogovor_to: NgbDateStruct,
    public request: string,
    public commission: string,
    public commission_prefix: string,
    public location: Location,
    public number_flat: number,
    public room: number,
    public room_separate: number,
    public area: number,
    public area_leave: number,
    public area_kitchen: number,
    public wc: number,
    public roof: number,
    public balcony: number,
    public terrace: number,
    public level: number,
    public elite: boolean,
    public new_building: boolean,
    public free_layout: boolean,
    public storey: number,
    public storeys: number,
    public repair: number,
    public communications: string,
    public floor: number,
    public furniture: number,
    public comment: string,
    public sale: number,
    public send: boolean,
    public title: string,
    public text: string,
    public approved: boolean,
    public import_id: number,
    public source: number,
    public photo_reclame: Photo [],
    public photo_plan: Photo [],
    public photo_request: Photo [],
    public photo_inside: Photo [],
    public delete_at: boolean,
    public created_at: Date,
    public updated_at: Date,
    public sale_addition_information: SaleAdditionInformation
  ) {}
}
