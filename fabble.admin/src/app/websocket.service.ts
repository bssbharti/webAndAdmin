import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { config } from '../../src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socket;

  constructor() { }

  connect() {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io(config.local.SOCKET_URL);
    return this.socket;
    // this.socket.emit('start',data)
    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    // let observable = new Observable(observer => {
    //     this.socket.emit('start', (data) => {
    //       console.log("Received message from Websocket Server")
    //       observer.next(data);
    //     })
    //     return () => {
    //       this.socket.disconnect();
    //     }
    // });
    
    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    // let observer = {
    //     next: (data: Object) => {
    //         this.socket.emit('message', JSON.stringify(data));
    //     },
    // };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    // return Rx.Subject.create(observer, observable);
  }

gameStart(data){
  console.log("start game000000",data);
  
  this.socket.emit('start',data)

}


}



