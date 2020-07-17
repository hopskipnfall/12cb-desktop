import { Component, OnInit, OnDestroy } from '@angular/core';
import { BattleService, CHARS, GameSnapshot, Character, Round, RoundInProgress, StateOverWire } from '../battle.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HistoryEncoderService } from '../history-encoder.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ThemeService, THEMES, Theme } from '../theme.service';
import { MatSelectChange } from '@angular/material/select';
import { Socket } from 'ngx-socket-io';

export interface RoundReplay {
  player1: {
    character: string;
    showImage: boolean;
    stocks: number;
  };
  player2: {
    character: string;
    showImage: boolean;
    stocks: number;
  };
}

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.sass']
})
export class ArenaComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  player1Selected: Character;
  player2Selected: Character;

  player1Name = '';
  player2Name = '';

  roundWinner = '';

  p1RemainingStocks = 0;
  p2RemainingStocks = 0;

  randomCharacter = CHARS[Math.floor(Math.random() * CHARS.length)];

  snapshot: GameSnapshot;

  selectedTheme: string;

  p1SelectMode = true;
  p2SelectMode = true;

  remainingStocksSelected = 0;

  initialStockCount = 0;

  gameOver = false;

  initialCharSelect = true;

  readonly LANGUAGES = [
    { code: 'en', display: 'English' },
    { code: 'ja', display: '日本語' },
  ];

  decoded: Round[];

  constructor(private battleService: BattleService,
              private router: Router,
              private encoder: HistoryEncoderService,
              private route: ActivatedRoute,
              private location: Location,
              private themeService: ThemeService,
              private socket: Socket) { }

  ngOnInit() {
    this.subscriptions.push(
      this.battleService.getPlayer1Name().subscribe(name => {
        this.player1Name = name;
      }),

      this.battleService.getPlayer2Name().subscribe(name => {
        this.player2Name = name;
      }),

      this.battleService.getRoundInProgress().subscribe((round: RoundInProgress) => {
        console.error('new round!', round);
        this.roundWinner = round.winner;
        this.player1Selected = round.player1;
        this.player2Selected = round.player2;

        this.p1SelectMode = !round.player1;
        this.p2SelectMode = !round.player2;
        this.initialCharSelect = (!round.player1 || !round.player2) && this.battleService.getHistory().length === 0;

        this.p1RemainingStocks = round.player1 ? round.player1.stocks : 0;
        this.p2RemainingStocks = round.player2 ? round.player2.stocks : 0;
        this.remainingStocksSelected = 0;
      }),

      this.battleService.getGameSnapshot().subscribe((snapshot: GameSnapshot) => {
        this.snapshot = snapshot;
      }),

      this.route.paramMap.subscribe(map => {
        console.log("It changed!!!!!!!!", map);
      }),

      this.socket.fromEvent('latestState')
        .subscribe(newState => {
          console.log('RECEIVED INITIAL STATE', newState);
          if (!newState) {
            return;
          }
          const s = newState as StateOverWire;
          this.battleService.loadState(s);
          this.themeService.setTheme(s.theme);
        }),

      this.socket.fromEvent('state')
        .subscribe(newState => {
          console.log('RECEIVED NEW DATA', newState);
          const s = newState as StateOverWire;
          this.themeService.setTheme(s.theme);
          this.battleService.loadState(s);
        }),
    );

    this.initialStockCount = this.battleService.getInitialStockCount();

    const m = this.route.snapshot.paramMap;
    if (m.has('p1')) {
      this.battleService.setPlayer1Name(m.get('p1'));
    }
    if (m.has('p2')) {
      this.battleService.setPlayer2Name(m.get('p2'));
    }
    if (m.has('historyEncoding')) {
      const loadedHistory = this.encoder.decodeHistory(m.get('historyEncoding'));
      this.battleService.loadHistory(loadedHistory);
    }

    this.selectedTheme = this.themeService.getTheme().value.name;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  characterClicked(player: string, character: Character) {
    if (character.stocks === 0) {
      return;
    }

    if (player === 'player1' && this.p1SelectMode) {
      this.battleService.player1Select(character);
    } else if (player === 'player2' && this.p2SelectMode) {
      this.battleService.player2Select(character);
    }
  }

  playerCharClicked(player: string) {
    if (this.player1Selected && this.player2Selected) {
      this.battleService.setRoundWinner(player);
    }
  }

  range(size: number) {
    const out = [];
    for (let i = 0; i < size; i++) {
      out.push(i);
    }
    return out;
  }

  submitRound() {
    this.battleService.submitRound(this.remainingStocksSelected);

    // if (this.roundWinner === 'player1') {
    //   this.p2SelectMode = true;
    // } else if (this.roundWinner === 'player2') {
    //   this.p1SelectMode = true;
    // }
    this.gameOver = this.battleService.isGameOver();

    if (this.gameOver) {
      const encoded = this.encoder.encodeHistory(this.battleService.getHistory());
      this.router.navigate([`/results/${encoded}`, { p1: this.player1Name, p2: this.player2Name }]);
    } else {
      // Load state into the URL.
      const encoded = this.encoder.encodeHistory(this.battleService.getHistory());
      const urlParams: { [key: string]: string } = {};
      if (this.player1Name) {
        urlParams.p1 = this.player1Name;
      }
      if (this.player2Name) {
        urlParams.p2 = this.player2Name;
      }
      const newUrl = this.router.createUrlTree([`/g/${encoded}`, urlParams]).toString();
      this.location.go(newUrl);
    }
  }

  maybeSetRemainingStocks(gate: boolean, remainingStocks: number) {
    if (gate) {
      this.remainingStocksSelected = remainingStocks;
    }
  }

  p1RemainingStocksSelected(stocks: number) {
    this.battleService.setRoundWinner('player1');
    this.remainingStocksSelected = stocks;
    this.submitRound();
  }

  p2RemainingStocksSelected(stocks: number) {
    this.battleService.setRoundWinner('player2');
    this.remainingStocksSelected = stocks;
    this.submitRound();
  }

  updateName(player: string, name: string) {
    if (player === 'player1') {
      this.battleService.setPlayer1Name(name);
    } else {
      this.battleService.setPlayer2Name(name);
    }
  }

  getThemes() {
    return THEMES.values();
  }

  randomThemeImage(theme: Theme) {
    return `assets/icons/${theme.name}/${this.randomCharacter}.${theme.imageExtension}`;
  }

  changeTheme(event: MatSelectChange) {
    this.themeService.setTheme(THEMES.get(this.selectedTheme));
  }

  showNewGameButton() {
    return this.route.snapshot.children.length > 0 && this.route.snapshot.children[0].params.historyEncoding;
    // return true;
  }

  newBattle() {
    this.battleService.clear();
    // Go up one level and let the server decide where to send you.
    window.location.href = '../';
  }

  undo() {
    this.battleService.undo();

    // TODO: Reflect undo in the URL.
  }
}
