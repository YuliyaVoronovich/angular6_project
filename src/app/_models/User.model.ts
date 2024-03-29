import {Company} from './Company.model';
import {Role} from './Role.model';
import {UserInformation} from './UserInformation.model';

export class User {

  constructor(

    public id: number,
    public login: string,
    public password_first: string,
    public manager_id: User,
    public company_id: Company,
    public role_id: Role,
    public updatetime: string,
    public access: number,
    public ban: number,
    public delete_user: number,
    public partner: boolean,
    public created_at: Date,
    public updated_at: Date,
    public api_key: string,
    public user_information: UserInformation,
    public manager_information: UserInformation,
    public company: Company,
    public permissions: any[] = []

  ) {}
}
