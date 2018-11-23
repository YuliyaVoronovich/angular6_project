import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Photo} from './Photo.model';

export class UserInformation {

  constructor(

    public id: number,
    public surname: string,
    public name: string,
    public patronymic: string,
    public phone1: string,
    public phone2: string,
    public passport: string,
    public date_of_birth: NgbDateStruct,
    public photo: Photo []

  ) {}
}
