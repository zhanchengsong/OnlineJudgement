import { Injectable } from '@angular/core';
import {COLORS} from "../../assets/colors";
declare var io:any;

declare var ace: any;
@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  collaborationSocket: any;
  constructor() { }

  clientsInfo: Object = {};
  clientNum: number = 0;

  init(editor: any, sessionId: string):void {
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});
    this.collaborationSocket.on("message",(message) => {
      console.log("received: " + message);
    })
    this.collaborationSocket.on("change", (delta:string) => {
      console.log("Editor Change received: " + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    })

    this.collaborationSocket.on("cursorMove", (cursor:string) => {
      console.log("Editor Cursor Move :" + cursor);
      cursor = JSON.parse(cursor);
      let session = editor.getSession();
      let x = cursor['row'];
      let y = cursor['column'];
      let changeClinetId = cursor['socketId'];

      if(changeClinetId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClinetId]['marker']);
      } else {
        this.clientsInfo[changeClinetId] = {};
        let css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".editor_cursor_" + changeClinetId
          + " { position:absolute; background:" + COLORS[this.clientNum] + ";"
          + " z-index: 100; width:3px !important; }";
        document.body.appendChild(css);
        this.clientNum ++;
      }
      let Range = ace.require('ace/range').Range;
      let newMarker = session.addMarker(new Range(x, y, x, y + 1), 'editor_cursor_' + changeClinetId, true);
      this.clientsInfo[changeClinetId]['marker'] = newMarker;

    })
  }

  change(delta:string) {
    this.collaborationSocket.emit("change",delta);

  }
  cursorMove(cursor:string) {
    this.collaborationSocket.emit("cursorMove",cursor);
  }

  restoreBuffer() {
    this.collaborationSocket.emit("restoreBuffer");
  }
}
