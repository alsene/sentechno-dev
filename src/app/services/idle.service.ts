import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private timeoutId: any;
  private readonly idleTime = 5 * 60 * 1000; // 30 minutes
  private events = ['click', 'mousemove', 'keydown', 'scroll'];
  private watching = false;

  startWatching() {
    if (!this.watching) {
      this.events.forEach(event =>
        window.addEventListener(event, () => this.resetTimer())
      );
      this.watching = true;
    }
    this.resetTimer();
  }

  stopWatching() {
    clearTimeout(this.timeoutId);
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      localStorage.removeItem('token');
      // Redirection vers login
    }, this.idleTime);
  }
}
