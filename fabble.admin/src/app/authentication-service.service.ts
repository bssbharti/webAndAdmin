import { Story } from './model/story';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { config } from "../../src/environments/environment";
//import "rxjs/add/operator/map";
import { Observable, throwError } from "rxjs";
import { Http, Response, Request, RequestMethod } from "@angular/http";
import { map, filter, catchError, mergeMap } from "rxjs/operators";
import { error } from "@angular/compiler/src/util";

@Injectable({
  providedIn: "root"
})
export class AuthenticationServiceService {
  constructor(private http: HttpClient, private newHttp: Http) {}

  allitems: any[];
  login(email: string, password: string) {
    return this.http.post<any>(`${config.local.API_URL}users/login`, { email: email, password: password }).pipe(
      map(user => {
        if (user && user.token) {

          localStorage.setItem("currentUser", JSON.stringify(user));
        }

        return user;
      })
    );
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${config.local.API_URL}users/forgotPassword`, { email: email }).pipe(
      map(user => {
        if (user.status != 0) {
          return { status: user.message };
        } else {
          status = user.message;
          alert(status);
        }
      })
    );
  }

  resetPassword(email: string, password: string, otp: string) {
    return this.http.post<any>(`${config.local.API_URL}users/resetPassword`, { email: email, password: password, otp: otp }).pipe(
      map(Response => {
        if (Response.status != 0) {
          return { status: Response.message };
        } else {
          status = Response.message;
          alert(status);
        }
      })
    );
  }

  allStoryList() {
    return this.http.get<any>(`${config.local.API_URL}story/allStoryList`, {}).pipe(
      map(Response => {
        if (Response.status != 0) {
          return { data: Response.AllStory };
        } else {
          status = Response.message;
          alert(status);
        }
      })
    );
  }

  getStoryDetailById(storyId) {
    //var url=`${config.local.API_URL}story/detailStory?`+storyId;
    return this.http.get<any>(`${config.local.API_URL}story/detailStory?storyId=` + storyId, {}).pipe(
      map(Response => {
        if (Response.status != 0) {
          var data = Response.Story[0];
          return data;
        } else {
          status = Response.message;
          alert(status);
        }
      })
    );
  }

  deleteStoryVideo(vId) {
    return this.http.post<any>(`${config.local.API_URL}story/deleteStoryVideo`, vId).pipe(
      map(
        Response => {
          if (Response.status != 0) {
            return Response;
          } else {
            status = Response.message;
            alert(status);
          }
        },
        error => {
          console.log(error);

          let msg = error;
        }
      )
    );
  }

  deleteStory(storyId) {
    return this.http.get<any>(`${config.local.API_URL}story/deleteStory?storyId=` + storyId, {}).pipe(
      map(
        Response => {
          return Response;
        },
        error => {
          console.log(error);

          let msg = error;
        }
      )
    );
  }

  deleteImageByStoryId(url,sId) {
    return this.http.post<any>(`${config.local.API_URL}story/deleteImage`, {imageName:url,storyId:sId}).pipe(
      map(
        Response => {
          if (Response.status != 0) {
            return Response;
          } else {
            status = Response.message;
            alert(status);
          }
        },
        error => {
          console.log(error);

          let msg = error;
        }
      )
    );
  }
  // createStory(requestData): Observable<any> {
  //     let request = new Request({
  //       method: RequestMethod.Post,
  //       url: config.local.API_URL + "story/createStory",
  //       body:  requestData
  //     });
  //     // if (this.auth_token) {
  //     //   request.headers.set("token", `${this.auth_token}`);
  //     // }
  //     return this.newHttp.request(request).pipe(map(response => {
  //       const json = response.json();
  //       if (json.status) {
  //         return json;
  //       } else {
  //         console.log("error", json.message);
  //         return json;
  //       }
  //     }));
  //   }

  createStory(newData) {
    return this.http.post<any>(`${config.local.API_URL}story/createStory`, newData).pipe(
      map(
        Response => {
          if (Response.status != 0) {
            return { data: Response };
          } else {
            status = Response.message;
            alert(status);
          }
        },
        error => {
          let msg = error;
        }
      )
    );
  }
  editStory(storyData) {
    return this.http.post<any>(`${config.local.API_URL}story/editStory`, storyData).pipe(
      map(
        Response => {
          if (Response.status != 0) {
            return { data: Response };
          } else {
            status = Response.message;
            alert(status);
          }
        },
        error => {
          let msg = error;
        }
      )
    );
  }
  searchStory(searhrequest) {
    return this.http.post<any>(`${config.local.API_URL}search/searchStory`, searhrequest).pipe(
      map(
        Response => {
          if (Response.status != 0) {
            return Response;
          } else {
            status = Response.message;
            alert(status);
          }
        },
        error => {
          console.log(error);
          let msg = error;
        }
      )
    );
  }

  allGenres() {
    return this.http.get<any>(`${config.local.API_URL}story/allGenres`, {}).pipe(
      map(Response => {
        if (Response.status != 0) {
          let cat = Response.category;
          var y = cat.map(temp => {
            //console.log("temp.name", temp.name);
            let items = temp.name;
            this.allitems = items;
          });
          //let filterData = cat.filter(proj => proj.name );
          //    console.log("filterData", filterData)
          return Response;
        } else {
          status = Response.message;
          alert(status);
        }
      })
    );
  }

  getitems() {
    return this.allitems;
  }

  detailStory(_id: string) {
    return this.http.get<any>(`${config.local.API_URL}story/detailStory?storyId=` + _id, {}).pipe(
      map(Response => {
        if (Response.status != 0) {
          return { data: Response };
        }
      })
    );
  }

  logout() {
    localStorage.removeItem("currentUser");
  }


  getStoryList(val){
    return this.http.post<any>(`${config.local.API_URL}search/getStoryList`, val).pipe(
      map(
        Response => {
          if (Response.status != 0) {
            return Response;
          } else {
            status = Response.message;
            alert(status);
          }
        },
        error => {
          console.log(error);
          let msg = error;
        }
      )
    );
  }
}
