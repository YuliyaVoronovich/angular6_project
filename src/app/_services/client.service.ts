import {Http, Response} from '@angular/http';
import {Globals} from '../_common/globals';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {Count} from '../_models/count.model';
import {Client} from '../_models/client.model';

@Injectable()
export class ClientService {

  private uri = '/clients';


  constructor(private http: Http,
              private router: Router,
              private globals: Globals) {
  }

  getClients(search = {}): Observable<Client[]> {
    return this.http.get(this.globals.url + this.uri, {search: search})
      .map((response: Response) => response.json().clients
      );
  }

  countClients(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  getClient(id) {
    return this.http.get(this.globals.url + this.uri + '/sale/' + id)
      .map((response: Response) => response.json());
  }

  create(client: Client): Observable<Response> {
    return this.http.post(this.globals.url + this.uri, JSON.stringify(client));
  }

  update(client: Client): Observable<Response> {
    return this.http.put(this.globals.url + this.uri + '/' + client.id, JSON.stringify(client));
  }

  delete(client: Client | number): Observable<Response> {
    const id = typeof client === 'number' ? client : client.id;
    return this.http.post(this.globals.url + this.uri + '/' + id, JSON.stringify(client));
  }
}
