import { Injectable } from '@angular/core';
import { BattleService, StateOverWire } from './battle.service';
import { ThemeService } from './theme.service';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateBroadcasterService {

  private subs: Subscription[] = [];

  constructor(private battleService: BattleService,
              private themeService: ThemeService,
              private socket: Socket) {
  }

  startListening() {
    this.subs.push(
      this.battleService.getPlayer1Name().subscribe(name => {
        this.broadcastState();
      }),

      this.battleService.getRoundInProgress().subscribe(round => {
        this.broadcastState();
      }),

      this.themeService.getTheme().subscribe(theme => {
        this.broadcastState();
      }),
    );

    this.broadcastState();
  }

  stopListening() {
    this.subs.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subs = [];
  }

  private broadcastState() {
    const newState: StateOverWire = {
      ...this.battleService.buildState(),
      theme: this.themeService.getTheme().value,
    };
    console.log('Broadcasting new state', newState);
    this.socket.emit('state', newState);
  }
}
