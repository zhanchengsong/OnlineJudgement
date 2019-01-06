import { Component, OnInit, Inject } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
declare var ace:any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any
  public languages: string[] = ['Java', 'C++', 'Python'];
  language: string = 'Java';
  output: string = '';
  sessionId:string;

  defaultContent = {
    'Java': `public class Example {
    public static void main(String[] args) {
        //Type your code here
      }
    }`,
    'C++': `#include <iostream>
     using namespace std;

    int main() {
      //Type your C++ code here
      return 0;
    }`,
    'Python': `class Solution:
     def example():
    # Write your Python code here`
  }

  languageBundleName = {
    'Java': `java`,
    'C++': `c_cpp`,
    'Python': `python`
  }


  constructor(@Inject('collaboration') private collabration,
                                        private route: ActivatedRoute) {

  }



  ngOnInit() {

    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
    })

    this.initEditor();



  }


  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  initEditor() {
    ace.config.set('basePath', '/ace-builds/src-noconflict');
    this.editor = ace.edit('editor');
    //this.editor.resize();
    this.editor.setOptions({
      maxLines: 35
    });
    this.editor.setAutoScrollEditorIntoView(true);
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
    document.getElementsByTagName('textarea')[0].focus();

    this.collabration.init();
    this.editor.lastAppliedChange = null;

    this.editor.on('change',e => {
        console.log('editor changes ' + JSON.stringify(e));
        if (this.editor.lastAppliedChange != e) {
          this.collabration.change(JSON.stringify(e));
        }
    })
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/' + this.languageBundleName[this.language]);
    this.editor.setValue(this.defaultContent[this.language]);
    this.output = '';
  }

  submit(): void {
    let userCode = this.editor.getValue();
    console.log(userCode);
  }
}
