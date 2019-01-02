import {Component, Inject, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'oj-client';
  constructor(@Inject("auth") private auth) {

  }

  ngOnInit() {

  }
}
