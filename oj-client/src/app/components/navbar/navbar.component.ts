import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {User} from "auth0";
import {applySourceSpanToExpressionIfNeeded} from "@angular/compiler/src/output/output_ast";
import {FormControl} from "@angular/forms";
import { Subscription} from "rxjs";
import { Router} from "@angular/router";
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  brandName = "COJ"
  username = ""
  profile: User;
  avator: string;

  searchBox: FormControl = new FormControl;

  subscription: Subscription;
  constructor(@Inject ("auth") private auth,
              @Inject ("input") private input,
              private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      if (localStorage.getItem("profile")) {
        this.username = JSON.parse(localStorage.getItem("profile")).nickname;
        this.avator = JSON.parse(localStorage.getItem("profile")).picture;
      }
    } else {
      console.log("Loading from observable");
      this.auth.userProfileChange$.subscribe(profile => {
        this.username = profile.nickname;
        this.avator = profile.picture;
      } )
    }
    this.subscription = this.searchBox
                            .valueChanges
                             .subscribe(
                               term => {
                                 this.input.changeInput(term);
                               }
                             )

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login() {
    this.auth.login()
      .then(profile=> {
        console.log(profile);
        this.username = profile.nickname})
      .catch(err => {console.log(err)});

  }

  logout(){
    this.auth.logout();
    this.username = "";
  }

  searchProblem() {
    this.router.navigate(['/problems']);
  }

}
