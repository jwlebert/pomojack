import { Component, computed, signal, WritableSignal } from '@angular/core';

interface TimeRecord {
  start?: number; // epoch
  remaining: number;
}

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
})

export class Timer {
  public active = signal(false);
  private times: WritableSignal<TimeRecord[]> = signal([
    {remaining: 20 * 60}
  ])

  private now = signal(Date.now());


  public startTimer() {
    console.log("hello");
    this.times.update(arr => {
      const copy = [...arr];
      copy[copy.length - 1].start = Date.now();
      return copy;
    })
    this.active.set(true);

    const intervalId = setInterval(() => {
      this.now.set(Date.now());
      if (!this.active()) { clearInterval(intervalId); }
    }, 1000);
  }

  public timeLeft = computed(() => {
    const recent = this.times()[this.times().length - 1];
    if (!recent.start) return recent.remaining;

    return this.now() - (recent.start ?? this.now());
  })
  // problem is its in miliseconds
}
