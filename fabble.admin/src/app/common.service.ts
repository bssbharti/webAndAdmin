


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { config } from '../../src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }
  getGamelist() {
    return this.http.get<any>(`${config.local.API_URL}admin/gameList`, {  })
        .pipe(map(game => {
          console.log("game===",game)
            // login successful if there's a jwt token in the response
            if (game && game.status ===1) {
                console.log("user===",game)
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                
            }

            return game;
        }));
}
addGame(dateTime :string,duration : string, location: string){
  return this.http.post<any>(`${config.local.API_URL}admin/addGame`, { startTime: dateTime, duration: duration,location:location })
          .pipe(map(user => {
              
              // login successful if there's a jwt token in the response
              if (user && user.status) {
                  console.log("user===",user)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                 
              }

              return user;
          }));
}

  getUser() {
      return this.http.get<any>(`${config.local.API_URL}admin/userlist`, {  })
          .pipe(map(user => {
            console.log("user===",user)
              // login successful if there's a jwt token in the response
              if (user && user.status ===1) {
                  console.log("user===",user)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
              }

              return user;
          }));
  }

  getUsersReport(){
    return this.http.get<any>(`${config.local.API_URL}admin/userReportList`, {  })
          .pipe(map(user => {
            console.log("user===",user)
              // login successful if there's a jwt token in the response
              if (user && user.status ===1) {
                  console.log("user===",user)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
              }

              return user;
          }));
  }
  getEventList(){
    return this.http.get<any>(`${config.local.API_URL}admin/eventlist`, {  })
          .pipe(map(event => {
            console.log("event===",event)
              // login successful if there's a jwt token in the response
              if (event && event.status ===1) {
                  console.log("event===",event)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
              }

              return event;
          }));
  }

  getEventReports(){
    return this.http.get<any>(`${config.local.API_URL}admin/channelReportList`, {  })
          .pipe(map(eventReport => {
            console.log("eventReport===",eventReport)
              // login successful if there's a jwt token in the response
              if (eventReport && eventReport.status ===1) {
                  console.log("event===",eventReport)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
              }

              return eventReport;
          }));
  }
  statusChange(id,status){
    return this.http.post<any>(`${config.local.API_URL}admin/statusChange`, {userId:id ,status:status})
          .pipe(map(statusChange => {
            console.log("statusChange===",statusChange)
              // login successful if there's a jwt token in the response
              if (statusChange && statusChange.status ===1) {
                  console.log("statusChange===",statusChange)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
              }

              return statusChange;
          }));
  }
  deleteUser(id){
    return this.http.post<any>(`${config.local.API_URL}admin/deleteUser`, {userId:id})
          .pipe(map(deleted => {
            console.log("deleted===",deleted)
              // login successful if there's a jwt token in the response
              if (deleted && deleted.status ===1) {
                  console.log("deleted===",deleted)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
              }

              return deleted;
          }));
  }
  notificationList(){
    return this.http.get<any>(`${config.local.API_URL}admin/getNotificationByAdmin`, {})
          .pipe(map(notification => {
            console.log("deleted===",notification)
              // login successful if there's a jwt token in the response
              if (notification && notification.notification ===1) {
                  console.log("notification===",notification)
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
              }

              return notification;
          }));
  }
  
}


