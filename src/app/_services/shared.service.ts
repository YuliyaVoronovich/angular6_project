import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SharedService {


  // 1 Observable string sources
  private emitChangeSource1 = new Subject<any>();
  // 2 Observable string sources
  private emitChangeSource2 = new Subject<any>();
  // 3 Observable string sources
  private emitChangeSource3 = new Subject<any>();
  // 4 Observable string sources
  private emitChangeSource4 = new Subject<any>();

  // 1 Observable string streams
  changeEmitted$1 = this.emitChangeSource1.asObservable();
  // 2 Observable string streams
  changeEmitted$2 = this.emitChangeSource2.asObservable();
  // 3 Observable string streams
  changeEmitted$3 = this.emitChangeSource3.asObservable();
  // 4 Observable string streams
  changeEmitted$4 = this.emitChangeSource4.asObservable();

  // 1Service message commands
  emitChange(change: any) {
    this.emitChangeSource1.next(change);
  }

  emitChange2(change: any) {
    this.emitChangeSource2.next(change);
  }

  emitChange3() {
    this.emitChangeSource3.next();
  }

  emitChange4() {
    this.emitChangeSource4.next();
  }

  constructor() {
  }
}
