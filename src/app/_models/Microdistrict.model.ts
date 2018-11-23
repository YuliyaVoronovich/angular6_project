import {District} from './District.model';

export class Microdistrict {

  constructor(
    public id: number,
    public district: District,
    public title: string,
    public coordinates: string,
  ) {}
}
