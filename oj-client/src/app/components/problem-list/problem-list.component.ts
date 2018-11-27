import {Component, Inject, OnInit} from '@angular/core';
import {Problem} from '../../models/problem.model';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problem: Problem[];
  constructor(@Inject("data") private data) { }
  ngOnInit() {
    this.problem = this.data.getProblems();
  }

}
