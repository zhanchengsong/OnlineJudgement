import { Injectable } from '@angular/core';
declare var io:any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  collaborationSocket: any;
  constructor() { }

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

    })
  }

  change(delta:string) {
    this.collaborationSocket.emit("change",delta);

  }
  cursorMove(cursor:string) {
    this.collaborationSocket.emit("cursorMove",cursor);
  }
}
