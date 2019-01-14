import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {



  constructor(@Inject("auth") private auth) {
    // Check for authentication and handle if hash present
    auth.handleAuth();
  }

  ngOnInit() {
  }

}
