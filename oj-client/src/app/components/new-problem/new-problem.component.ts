import {Component, Inject, OnInit} from '@angular/core';
import { Problem} from '../../models/problem.model';
import { FormsModule }   from '@angular/forms';
const DEFAULT_PROBELM : Problem = Object.freeze({
  id: 0,
  name: "",
  desc: "",
  difficulty: 'Easy'
});

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {

  constructor(@Inject ("data") private data,
              @Inject ("auth-guard") private authGuard) { }
  public difficulties = ["Easy", "Medium","Hard","Super"];

  newProblem: Problem = Object.assign({}, DEFAULT_PROBELM)

  ngOnInit() {

  }
  addProblem() : void{
    this.data.addProblem(this.newProblem).catch(error => alert(error.body));
    this.newProblem = Object.assign({},DEFAULT_PROBELM)
  }


}
