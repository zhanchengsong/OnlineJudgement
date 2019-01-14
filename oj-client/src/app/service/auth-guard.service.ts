import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(@Inject('auth') private auth,
              private router : Router)
  { }

  canActivate() : boolean {
    if (this.auth.loggedIn) {
      return true;
    } else {
      this.router.navigate(['/problems']);
      return false;
    }

  }

  isAdmin() : boolean {
    return  (this.auth.loggedIn && this.auth.userProfile && this.auth.isAdmin );
  }
}
