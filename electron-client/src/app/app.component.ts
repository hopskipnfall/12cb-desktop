import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'electron-client';

  constructor(private socket: Socket) {
  }

  sendMessage(m: string) {
    this.socket.emit('chat message', m);
  }
}
