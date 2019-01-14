
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as auth0 from 'auth0-js';
declare var Auth0Lock: any;
import {BehaviorSubject, Observable, Observer} from "rxjs";
import {Headers, Http, RequestOptions} from "@angular/http";
import {tokenNotExpired} from "angular2-jwt";
import {User} from "auth0";
import {AUTH_CONFIG} from "../auth/auth.config";
import {ENV} from "../core/env.config";


@Injectable()
export class AuthService {
  private _auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    //audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE


  });



  accessToken: string;
  userProfile: any;
  expiresAt: number;

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  loggingIn: boolean;

  isAdmin: boolean;

  constructor(private router: Router) {
    // If app auth token is not expired, request new token
    if (JSON.parse(localStorage.getItem('expires_at')) > Date.now()) {
      this.renewToken();
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 authorize request
    console.log("redirect " + AUTH_CONFIG.REDIRECT);
    this._auth0.authorize();
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this._auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this._getProfile(authResult);
      } else if (err) {
        console.error(`Error authenticating: ${err.error}`);
      }
      this.router.navigate(['/']);

    });
  }

  private _getProfile(authResult) {
    this.loggingIn = true;
    // Use access token to retrieve user's profile and set session
    this._auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        this._setSession(authResult, profile);
      } else if (err) {
        console.warn(`Error retrieving profile: ${err.error}`);
      }
    });
  }

  private _setSession(authResult, profile?) {
    this.expiresAt = (authResult.expiresIn * 1000) + Date.now();
    // Store expiration in local storage to access in constructor
    localStorage.setItem('expires_at', JSON.stringify(this.expiresAt));

    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
      this.userProfile = profile;
      this.isAdmin = this._checkAdmin(profile)
    }

    this.accessToken = authResult.accessToken;

    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
    this.loggingIn = false;
  }

  private _clearExpiration() {
    // Remove token expiration from localStorage
    localStorage.removeItem('expires_at');
  }

  private _checkAdmin(profile) {
    // Check if the user has admin role
    const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
    return roles.indexOf('admin') > -1;
  }


  logout() {
    // Remove data from localStorage
    this._clearExpiration();
    // End Auth0 authentication session
    this._auth0.logout({
      clientId: AUTH_CONFIG.CLIENT_ID,
      returnTo: ENV.BASE_URI
    });
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    return Date.now() < JSON.parse(localStorage.getItem('expires_at'));
  }

  renewToken() {
    // Check for valid Auth0 session
    this._auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken) {
        this._getProfile(authResult);
      } else {
        this._clearExpiration();
      }
    });
  }
}

//    private _idToken: string;
//    private _accessToken: string;
//   // private _expiresAt: number;
//
//   private profile_observer: Observer<User>;
//   userProfileChange$: Observable<User> = new Observable(obs => this.profile_observer = obs);
//
//   userProfile: any;
//
//   auth0Options = {
//     theme: {
//
//       primaryColor: '#DFA612'
//     },
//     auth: {
//       redirectUrl: "http://localhost:3000/problems",
//       responseType: 'token id_token',
//       audience: `https://onlinecodingjudge.auth0.com/userinfo`,
//       params: {
//         scope: 'openid profile email roles'
//       }
//     },
//     autoclose: true,
//     oidcConformant: true,
//   };
//
//   lock = new Auth0Lock('WmcMlWdwZz2ClNWyMH8VCo1AQCK6aPQo' ,'onlinecodingjudge.auth0.com', this.auth0Options);
//
//
//   constructor(private http : Http,public router: Router) {
//     this.lock.on('authenticated', (authResult: any) => {
//       this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
//         if (error) {
//           throw new Error(error);
//         }
//
//         localStorage.setItem('token', authResult.idToken);
//         localStorage.setItem('profile', JSON.stringify(profile));
//         this.userProfile = profile;
//         this.profile_observer.next(profile);
//         this.router.onSameUrlNavigation = 'reload';
//         this.router.navigate(['/home']);
//         // this.router.navigate(['/']);
//       });
//     });
//
//     this.lock.on('authorization_error', function(error) {
//       this.lock.show({
//         flashMessage: {
//           type: 'error',
//           text: error.errorDescription
//         }
//       });
//     });
//
//
//   }
//
//   public login(): Promise<Object> {
//     return new Promise((resolve, reject) => {
//       // Call the show method to display the widget.
//       this.lock.show((error: string, profile: Object, id_token: string) => {
//         if (error) {
//           console.log(error);
//           reject(error);
//         } else {
//           localStorage.setItem('profile', JSON.stringify(profile));
//           localStorage.setItem('id_token', id_token);
//           console.log(profile);
//           resolve(profile);
//         }
//       });
//     })
//   }
//
//   logout() {
//     localStorage.removeItem('profile');
//     localStorage.removeItem('token');
//   }
//
//   isAuthenticated() {
//     return tokenNotExpired();
//   }
//
//   getProfile() :User {
//       if (this.userProfile) {
//         return this.userProfile;
//       } else {
//         this.lock.getUserInfo(localStorage.getItem("token"), function(error, profile) {
//           if (error) {
//             console.log(error);
//             return;
//           }
//           this.userProfile = profile;
//           return profile;
//         });
//       }
//   }
//
//   public resetPassword() {
//     let profile = this.getProfile();
//     let url : string = `https://onlinecodingjudge.auth0.com/dbconnections/change_password`;
//     let headers = new Headers({'content-type': 'application/json'});
//     let body = {
//       client_id: "WmcMlWdwZz2ClNWyMH8VCo1AQCK6aPQo",
//       email: profile.email,
//       connection: 'Username-Password-Authentication'
//     }
//     const options = new RequestOptions ({headers: headers})
//     this.http.post(url, body, options)
//       .toPromise()
//       .then( res => {
//         console.log(res);
//         alert("An email was just sent to reset your password");
//       })
//       .catch(this.handleError);
//   }
//
//   private handleError(error : any) : Promise<any> {
//     console.error('An error occurred', error);
//     return Promise.reject(error.message || error);
//   }
//
//   public isAdmin(profile) : boolean {
//     const roles = profile['http://newgrad-developer.com/roles'] || [];
//     return roles.indexOf('admin') > -1;
//   }
//
//   // auth0 = new auth0.WebAuth({
//   //   clientID: 'WmcMlWdwZz2ClNWyMH8VCo1AQCK6aPQo',
//   //   domain: 'onlinecodingjudge.auth0.com',
//   //   responseType: 'token id_token',
//   //   redirectUri: 'http://localhost:3000/callback',
//   //   scope: 'openid profile'
//   // });
//   //
//   // constructor(public router: Router) {
//   //   this._idToken = '';
//   //   this._accessToken = '';
//   //   this._expiresAt = 0;
//   // }
//   //
//   // get accessToken(): string {
//   //   return this._accessToken;
//   // }
//   //
//   // get idToken(): string {
//   //   return this._idToken;
//   // }
//   //
//   // public login(): void {
//   //   this.auth0.authorize();
//   // }
//   //
//   // public handleAuthentication(): void {
//   //   this.auth0.parseHash((err, authResult) => {
//   //     if (authResult && authResult.accessToken && authResult.idToken) {
//   //       window.location.hash = '';
//   //       this.setSession(authResult).then( profile =>
//   //          { this.router.navigate(['/home']); }
//   //       );
//   //
//   //
//   //     } else if (err) {
//   //       this.router.navigate(['/home']);
//   //       console.log(err);
//   //     }
//   //
//   //   });
//   // }
//   //
//   //
//   //
//   // private setSession(authResult): Promise<any> {
//   //   // Set isLoggedIn flag in localStorage
//   //   localStorage.setItem('isLoggedIn', 'true');
//   //   // Set the time that the access token will expire at
//   //   const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
//   //   this._accessToken = authResult.accessToken;
//   //   localStorage.setItem("accessToken",authResult.accessToken);
//   //   localStorage.setItem("expiresAt", expiresAt.toString());
//   //   console.log(authResult.accessToken);
//   //   this._idToken = authResult.idToken;
//   //   this._expiresAt = expiresAt;
//   //
//   //   if (!localStorage.getItem("accessToken")) {
//   //     throw new Error('Access Token must exist to fetch profile');
//   //   }
//   //   this.fetchProfile(localStorage.getItem("accessToken")).
//   //         then(profile => this.userProfile = profile)
//   //         .catch(err => console.log(err));
//   //
//   //   return new Promise((resolve,reject) => {
//   //         resolve(this.userProfile);
//   //   });
//   // }
//   //
//   // public renewSession(): void {
//   //   this.auth0.checkSession({}, (err, authResult) => {
//   //     if (authResult && authResult.accessToken && authResult.idToken) {
//   //       this.setSession(authResult);
//   //     } else if (err) {
//   //       alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
//   //       this.logout();
//   //     }
//   //   });
//   // }
//   //
//   // public logout(): void {
//   //   // Remove tokens and expiry time
//   //   this._accessToken = '';
//   //   this._idToken = '';
//   //   this._expiresAt = 0;
//   //   // Remove isLoggedIn flag from localStorage
//   //   localStorage.removeItem('isLoggedIn');
//   //   localStorage.removeItem('accessToken');
//   //   localStorage.removeItem('profile');
//   //   localStorage.removeItem('expiresAt');
//   //   // Go back to the home route
//   //   this.router.navigate(['/']);
//   // }
//   //
//   // public isAuthenticated(): boolean {
//   //   // Check whether the current time is past the
//   //   // access token's expiry time
//   //   return new Date().getTime() < Date.parse( localStorage.getItem("expiresAt") );
//   // }
//   //
//   // public getProfile(accessToken,cb): void {
//   //   if (!accessToken) {
//   //     throw new Error('Access Token must exist to fetch profile');
//   //   }
//   //
//   //   const self = this;
//   //   this.auth0.client.userInfo(this.accessToken, (err, profile) => {
//   //     if (profile) {
//   //       self.userProfile = profile;
//   //
//   //     }
//   //     cb(err, profile);
//   //   });
//   // }
//   //
//   // public fetchProfile(accessToken:string): Promise<any> {
//   //   return new Promise((resolve, reject) => {
//   //
//   //     this.getProfile(accessToken,(err, prof) => {
//   //       if (err) {
//   //         reject(err);
//   //       } else {
//   //         localStorage.setItem('profile', JSON.stringify(prof));
//   //         resolve(prof);
//   //       }
//   //     });
//   //   });
//   // }
// }
