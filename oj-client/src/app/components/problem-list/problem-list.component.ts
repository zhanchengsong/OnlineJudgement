import { Component, OnInit } from '@angular/core';
import {Problem} from '../../models/problem';

const PROBLEM: Problem[] = [
  {
    id: 1,
    name: 'Two Sums',
    desc: 'Given an array of integers, find two numbers such that they add up to a specific given targer number',
    difficulty: 'Easy'
  },
  {
    id: 2,
    name: '3 Sums',
    desc: 'Given an array of integers, find three numbers such that they add up to a specific given targer number',
    difficulty: 'Easy'
  }];

@Component({
  selector: 'app-problem-list',
  template: `
    <div class="container">
        <div class="list-group">
           <a class="list-group-item">

            </a>
         </div>
    </div>
  `,
  styles: []
})
export class ProblemListComponent implements OnInit {
  problem: Problem[];
  constructor() { }
  ngOnInit() {
    this.problem = PROBLEM;
  }

}
