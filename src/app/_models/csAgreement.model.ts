export class CsAgreement {

  constructor(
    public id: number,
    public address: string,
    public rooms: number,
    public price: number,
    public price_m: number,
    public share: string,
    public district: string,
    public storey: number,
    public storeys: number,
    public walls: string,
    public area: number,
    public date_registration: Date,
    public date_cs: Date
  ) { }
}
