import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private timeoutId: any;
  private readonly idleTime = 10 * 60 * 1000; // 10 minutes d'inactivité, on se déconnecte automatiquement
  private events = ['click', 'mousemove', 'keydown', 'scroll'];
  private watching = false;
  private readonly boundResetTimer = () => this.resetTimer();

  private readonly idleTimeout = new Subject<void>();
  readonly idleTimeout$ = this.idleTimeout.asObservable();

  startWatching() {
    if (!this.watching) {
      this.events.forEach(event =>
        window.addEventListener(event, this.boundResetTimer)
      );
      this.watching = true;
    }
    this.resetTimer();
  }

  stopWatching() {
    clearTimeout(this.timeoutId);
    if (this.watching) {
      this.events.forEach(event =>
        window.removeEventListener(event, this.boundResetTimer)
      );
      this.watching = false;
    }
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.idleTimeout.next();
    }, this.idleTime);
  }
}
