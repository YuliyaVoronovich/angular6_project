import {RequestOptions, BaseRequestOptions, RequestOptionsArgs} from '@angular/http';

export class HeaderService extends BaseRequestOptions {

  constructor() {
    super();
    this.headers.set('Content-Type', 'application/json');
  }

  merge(options?: RequestOptionsArgs): RequestOptions {
    const token = localStorage.getItem('tokenUser');
    const newOptions = super.merge(options);
    if (token) {
      newOptions.headers.set('Authorization', `Bearer ${token}`);
    }
    return newOptions;
  }
}
