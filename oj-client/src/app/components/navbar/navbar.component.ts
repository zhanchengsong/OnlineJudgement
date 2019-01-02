import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {User} from "auth0";
import {applySourceSpanToExpressionIfNeeded} from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  brandName = "COJ"
  username = "Default"
  profile: User;

  constructor(@Inject ("auth") private auth) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      if (localStorage.getItem("profile")) {
        this.username = JSON.parse(localStorage.getItem("profile")).nickname;
      }
    } else {
      console.log("Loading from observable");
      this.auth.userProfileChange$.subscribe(profile => {
        this.username = profile.nickname;
      } )
    }

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



}
