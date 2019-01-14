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


  searchBox: FormControl = new FormControl;

  subscription: Subscription;
  constructor(@Inject ("auth") private auth,
              @Inject ("input") private input,
              private router: Router) { }

  ngOnInit() {

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
    this.auth.login();

  }

  logout(){
    this.auth.logout();

  }

  searchProblem() {
    this.router.navigate(['/problems']);
  }

}
