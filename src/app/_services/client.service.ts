import {Http, Response} from '@angular/http';
import {Globals} from '../_common/globals';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {Count} from '../_models/Count.model';
import {Client} from '../_models/Client.model';

@Injectable()
export class ClientService {

  private uri = '/clients';
  private uri_archive = '/archive/clients';


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
    return this.http.get(this.globals.url + this.uri + '/client/' + id)
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

  /*Архив*/
  getClientsArchive(search = {}): Observable<Client[]> {
    return this.http.get(this.globals.url + this.uri_archive, {search: search})
      .map((response: Response) => response.json().clients
      );
  }
  countClientsArchive(search = {}): Observable<Count> {
    return this.http.get(this.globals.url + this.uri_archive + '/count', {search: search})
      .map((response: Response) => response.json()
      );
  }
  restoreClient(client: Client) {
    return this.http.put(this.globals.url + this.uri_archive + '/restore/' + client.id, JSON.stringify(client))
      .map((response: Response) => response.json()
      );
  }
  /*Архив*/
}
