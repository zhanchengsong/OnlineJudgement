import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule} from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { DataService} from './service/data.service';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import {routing} from './app.routes';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { NavbarComponent } from './components/navbar/navbar.component'
import {AuthService} from "./service/auth.service";
import { CallbackComponent } from './components/callback/callback.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditorComponent } from './components/editor/editor.component';
import {CollaborationService} from "./service/collaboration.service";
import { SearchPipe } from './pipes/search.pipe';
import {InputService} from "./service/input.service";
import {AuthGuardService} from "./service/auth-guard.service";

@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavbarComponent,
    CallbackComponent,
    ProfileComponent,
    EditorComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    routing,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: "data",
    useClass: DataService
  },
    {
      provide: "auth",
      useClass: AuthService
    },
    {
      provide:"collaboration",
      useClass: CollaborationService
    },
    {
      provide:"input",
      useClass: InputService
    },
    {
      provide: "auth-guard",
      useClass: AuthGuardService
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
