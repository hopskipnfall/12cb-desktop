import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Message {
  author: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PushListenerService {
  public messages: Subject<Message>;

  // constructor(private socket: Socket) {

  // this.socket
  //         .fromEvent('message')
  //         .pipe(map( (data: any) => data.msg ))
  //         .subscribe(d => {
  //           console.log('PRINTING IT OUT', d);
  //         });

  // socket.emit('chat message', 'boted up!!');
  // // wsService.v2connect(CHAT_URL);

  // const socket = new WebSocket('ws://localhost:3000');

  // // Connection opened
  // socket.addEventListener('open', event => {
  //   socket.send('Hello Server!');
  // });

  // // Listen for messages
  // socket.addEventListener('message', event => {
  //   console.log('Message from server ', event.data);
  // });

  // // this.messages = wsService.connect(CHAT_URL).pipe(
  // //   map((response: MessageEvent): Message => {
  // //     console.log('MY MESSAGE EVENT HAPPENED', response);
  // //     const data = JSON.parse(response.data);
  // //     return {
  // //       author: data.author,
  // //       message: data.message
  // //     };
  // //   })) as Subject<Message>;
  // }
}
