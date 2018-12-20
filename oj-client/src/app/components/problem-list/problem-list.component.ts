import {Component, Inject, OnInit} from '@angular/core';
import {Problem} from '../../models/problem.model';
import {Subscription} from "rxjs";


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[];
  subscriptionProblems: Subscription;
  constructor(@Inject("data") private data) { }

  ngOnInit() {
    this.subscriptionProblems = this.data.getProblems().subscribe(problems => this.problems = problems);

  }

}
