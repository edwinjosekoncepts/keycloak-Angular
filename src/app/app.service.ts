import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

export class Foo {
  constructor(
    public id: number,
    public name: string) { }
}

@Injectable()
export class AppService {
  public clientId = 'oauth-client';
  public redirectUri = 'http://localhost:4200';

  constructor(
    private _http: HttpClient) { }

  retrieveToken(code: any) {
    let params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.redirectUri);
    params.append('code', code);

    let headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8' });
    this._http.post('http://3.17.48.141:8580/auth/realms/master/protocol/openid-connect/token', params.toString(), { headers: headers })
      .subscribe(
        data => this.saveToken(data),
        err => alert('Invalid Credentials')
      );
  }

  saveToken(token: any) {
    var expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set("access_token", token.access_token, expireDate);
    Cookie.set("id_token", token.id_token, expireDate);
    Cookie.set("demo", token.name, expireDate);
    console.log(token);
    // window.location.href = 'http://localhost:4200'; 
  }

  getResource(resourceUrl: any): Observable<any> {
    var headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Bearer ' + Cookie.get('access_token') });
    return this._http.get(resourceUrl, { headers: headers })
    // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkCredentials() {
    return Cookie.check('access_token');
  }

  logout() {
    let token = Cookie.get('id_token');
    Cookie.delete('access_token');
    Cookie.delete('id_token');
    let logoutURL = "http://3.17.48.141:8580/auth/realms/master/protocol/openid-connect/logout?id_token_hint="
      + token
      + "&post_logout_redirect_uri=" + this.redirectUri;

    window.location.href = logoutURL;
  }
}
