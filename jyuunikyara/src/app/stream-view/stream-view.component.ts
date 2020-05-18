import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { PushListenerService } from '../push-listener.service';

@Component({
  selector: 'app-stream-view',
  templateUrl: './stream-view.component.html',
  styleUrls: ['./stream-view.component.sass']
})
export class StreamViewComponent implements OnInit {

  message: Observable<string>;

  constructor(private pushListener: PushListenerService, private socket: Socket) {
    this.socket.emit('chat message', 'boted up!!');
    this.message = this.socket
      .fromEvent('chat message');
  }

  ngOnInit() {
  }
}
