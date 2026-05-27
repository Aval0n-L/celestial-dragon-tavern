import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeOfDayService {
  private readonly timeSource = new BehaviorSubject<string | null>(null);
  readonly timeOfDay$ = this.timeSource.asObservable();

  setTime(time: string | null) {
    this.timeSource.next(time ? time.toLowerCase() : null);
  }

  get currentTime(): string | null {
    return this.timeSource.value;
  }
}
