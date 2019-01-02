import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any;
  username:string;
  email:string;
  constructor(@Inject("auth") private auth) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      if( localStorage.getItem("profile") ) {
        this.profile = JSON.parse(localStorage.getItem("profile"));
        console.log(this.profile);
      }
      else {
        this.profile = this.auth.getProfile();
      }
    }
    this.username = this.profile.nickname;
    this.email = this.profile.email;
  }

}
