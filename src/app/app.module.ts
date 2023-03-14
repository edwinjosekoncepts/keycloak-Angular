import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewComponent } from './new/new.component';

function initializeKeyCloak(keycloak: KeycloakService) {
  return async () => {
    let c = await keycloak.init({
      config: {
        url: 'http://3.17.48.141:8580/auth',
        realm: 'master',
        clientId: 'oauth-client'
      },
      initOptions: {
        onLoad: "login-required",
        flow: "standard",
        checkLoginIframe: false
      },
      enableBearerInterceptor: true,
      loadUserProfileAtStartUp: true,
    })

    console.log(c);

    // try {
    //   let c = keycloak.init({
    //     config: {
    //       url: 'http://3.17.48.141:8989/',
    //       realm: 'master',
    //       clientId: 'oauth-client'
    //     },
    //     initOptions: {
    //       onLoad: 'login-required',
    //       checkLoginIframe: false
    //     },
    //     enableBearerInterceptor: true
    //   });
    //   console.log('Keycloak is initialized');
    // } catch (error) {
    //   console.error('Error initializing Keycloak', error);
    // }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeyCloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
