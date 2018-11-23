import {Company} from './Company.model';

export class Role {

  constructor(

    public id: number,
    public title: string,
    public company: Company,
    public array_permissions: any[] = []
  ) {}
}
