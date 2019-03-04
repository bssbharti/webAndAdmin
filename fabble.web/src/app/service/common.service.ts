import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError , BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ApiService} from './api/api.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public list = new BehaviorSubject({});
  public listStory:any = this.list.asObservable();
  public searchItem:any = {};
  public topStory:any;
  public filterupdate:boolean;
  public activeAudio:any;
  public allGenresList:any;
  public hideHeroBanner=false;
  public activepage:string;
  public RelatedStoryList:any;

  constructor(public http: HttpClient, public apiLink : ApiService, private router: Router) {
    this.http.get(this.apiLink.topstory).pipe( retry(3), catchError(this.handleError)).subscribe( 
      data => {this.topStory = data;},
      error => console.log(error)
    );
    
    this.http.get(this.apiLink.allGenres).pipe( retry(3), catchError(this.handleError)).subscribe( 
      data => {this.allGenresList = data;}, // console.log(data)
      error => console.log(error)
    );
  }
  
  cleartagval(){
    this.searchItem.tags = '';
    this.hideHeroBanner = false;
  }
  addtag(val){
    // console.log(val)
    this.searchItem.tags = val;
    this.storyItem({},1,this.searchItem.count, "tags");
  }

  storyItem=(values, page, count, callby)=>{
    // console.log( values, page, count, callby)    
    if (callby === "header")
    {
      this.hideHeroBanner = true;
      this.searchItem.name = values.name || '';      
      const selectedOrderIds =[] ;
      values.gen.map((v, i) => v ? selectedOrderIds.push(this.allGenresList.category[i]._id) : null)
      .filter(v => v !== null);
      //this.searchItem.gen = values.gen[0] == null ? [] : values.gen;
      this.searchItem.gen = selectedOrderIds;

      this.searchItem.ratings = values.ratings || '';
      this.searchItem.count = count;
      this.searchItem.page = page;
      // this.searchItem.genresId = values.genresId || '';
      this.searchItem.videoDuration = values.videoDuration || '';
      this.filterupdate = true;
      if(this.activepage === 'detail')
        this.router.navigate(['/index']);
      
    }
    
    if(callby === "tags")
    {
      this.searchItem.page = page;
      this.hideHeroBanner = true;
      this.filterupdate = true;
      if(this.activepage === 'detail')
        this.router.navigate(['/index']);
    }
    if(callby === "logo")
    {
      this.searchItem.count = count;
      this.searchItem.ratings = '';
      this.searchItem.gen = [];
      this.searchItem.page = page;
      this.searchItem.name = '';
      this.searchItem.videoDuration ='';
      this.filterupdate = false;
    }
    else{
      this.searchItem.count = count;
      this.searchItem.page = page;
      this.filterupdate = false;
    }

    let body = this.searchItem; //{name:'', tags:'', ratings:'RESTRICTED', videoDuration:'', count:'', genresId:{} };
    this.http.post(this.apiLink.getStoryList,body, httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    ).subscribe( 
      data => {
        this.listStory = data;
        return this.listStory;
      },
      error => console.log(error)
    )
  }

  /*get story Detail*/
  storydetail(id){
    return this.http.get(this.apiLink.storyDetail+id).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  /*get genrees list*/
  // genreslist(){
  //   return this.http.get(this.apiLink.allGenres).pipe(
  //     retry(3),
  //     catchError(this.handleError)
  //   );
  // }

  /*get genrees list*/
  subFun(email){
    return this.http.post(this.apiLink.subscribapi,{email:email}, httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  activePlayer(id){
    if(this.activeAudio !== id)
      this.activeAudio = id;    
  }
  private handleError(error) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

  relatedStoryAPI(id){
    this.http.get(this.apiLink.relativeStory+id).pipe( retry(3), catchError(this.handleError)).subscribe( 
      data => {this.RelatedStoryList =  data;},
      error => console.log(error)
    );     
  }
}
