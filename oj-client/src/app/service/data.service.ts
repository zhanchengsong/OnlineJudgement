import {Inject, Injectable} from '@angular/core';
import {Problem} from '../models/problem.model';
import {PROBLEMS} from '../mock-problems';
import {find} from 'rxjs/operators';
import {Http, Response, Headers, RequestOptions} from '@angular/http'
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class DataService {

  private problemSource = new BehaviorSubject<Problem[]>([]);
  constructor(private http: Http) { }

  private handleError(error:any): Promise<any> {
    console.error('An error had occured' , error);
    return Promise.reject(error.body || error);
  }

  getProblems(): Observable<Problem[]>{
    this.http.get('api/v1/problems')
      .toPromise()
      .then((res:Response) => {
        this.problemSource.next(res.json());
      })
      .catch (this.handleError);

    return this.problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res:Response) => res.json() )
      .catch (this.handleError);

  }
  addProblem(newProblem: Problem): Promise<Problem> {
      let headers = new Headers({'content-type':'application/json'});
      const options = new RequestOptions ({headers: headers})
      return this.http.post('/api/v1/problem',newProblem, options )
        .toPromise()
        .then((res:Response) => {
          this.getProblems(); //refresh the previous observable
          return res.json()
        }).catch(this.handleError);

  }
  buildAndRun(data:any): Promise<Object> {
    console.log("Service called in Angular")
    let headers = new Headers({'content-type':'application/json'});
    const options = new RequestOptions ({headers: headers})
    return this.http.post('/api/v1/build_and_run',data, options )
      .toPromise()
      .then((res: Response) => {
        console.log(res);
        return res.json();
      })
      .catch(this.handleError);
  }
}
