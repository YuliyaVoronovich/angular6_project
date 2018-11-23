import {PermissionCategory} from './PermissionCategory.model';

export class Permission {

  constructor(

    public id: number,
    public title: string,
    public permissions: PermissionCategory,
    public check: string
  ) {}
}
