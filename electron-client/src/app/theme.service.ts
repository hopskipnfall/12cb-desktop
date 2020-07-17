import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Theme {
  name: string;
  imageExtension: string;
}

const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const THEMES = new Map([
  ['sekirei', {name: 'sekirei', imageExtension: 'png'}],
  ['jouske', {name: 'jouske', imageExtension: 'svg'}],
  ['classic', {name: 'classic', imageExtension: 'png'}],
  ['nanakyou', {name: 'nanakyou', imageExtension: 'png'}],
]);

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly theme: BehaviorSubject<Theme> = new BehaviorSubject(
      THEMES.get(random(['jouske', 'classic', 'nanakyou'])));

  constructor() { }

  setTheme(theme: Theme) {
    this.theme.next(theme);
  }

  getTheme() {
    return this.theme;
  }

  getCharacterImage(char: string) {
    if (!char) {
      return '';
    }
    const t = this.theme.value;
    return `assets/icons/${t.name}/${char}.${t.imageExtension}`;
  }
}