import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavbarComponent,
    CallbackComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    routing,
    FormsModule
  ],
  providers: [{
    provide: "data",
    useClass: DataService
  },
    {
      provide: "auth",
      useClass: AuthService
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
