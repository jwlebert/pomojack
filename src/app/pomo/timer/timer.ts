import { Component, computed, effect, Pipe, PipeTransform, signal, WritableSignal } from '@angular/core';

class TimeRecord {
  duration: number;
  remaining: number;
  segments: WritableSignal<[Date, Date?][]>;
  public curSegment = computed(() => 
    this.segments()[this.segments().length - 1]
  )

  public constructor(duration = 20 * 60) {
    this.duration = duration;
    this.remaining = duration;
    this.segments = signal([]);
  }

  public startSegment() {
    this.segments.set([...this.segments(), [new Date(), undefined]]);
  }

  public endSegment() {
    const copy = [...this.segments()];
    copy[copy.length - 1][1] = new Date();
    this.segments.set(copy);

    const latest = this.curSegment() as [Date, Date];
    this.remaining -= Math.floor((latest[1].getTime() - latest[0].getTime()) / 1000);
  }
}

@Pipe({ name: 'TimerDisplayPipe'})
export class TimerDisplayPipe implements PipeTransform {
  transform(value: number): string {
    const h = Math.floor(value / 3600);
    const hSeg = h > 0 ? `${h}:` : '';

    const m = Math.floor((value % 3600) / 60);
    const mStr = ('00' + m).slice(-2);
    
    const s = value % 60;
    const sStr = ('00' + s).slice(-2);
    
    return `${hSeg}${mStr}:${sStr}`;
  }
}

@Component({
  selector: 'app-timer',
  imports: [TimerDisplayPipe],
  templateUrl: './timer.html',
})

export class Timer {
  public active = signal(false);
  private record = signal(new TimeRecord());

  private now = signal(new Date());
  constructor() {
    effect(() => {
      if (this.active()) {
        const intervalId = setInterval(() => {
          this.now.set(new Date());
          if (!this.active()) { clearInterval(intervalId); }
        }, 250);
        return () => clearInterval(intervalId);
      }
      
      return () => this.now.set(new Date());
    });
    // effect makes 'now' update continuously while active
  }
  
  public startTimer() {
    this.record().startSegment();
    this.now.set(new Date());
    this.active.set(true);
  }

  public pauseTimer() {
    this.record().endSegment();
    this.active.set(false);
  }

  public timeLeft = computed(() => {
    if (!this.active()) return this.record().remaining;

    const start = this.record().curSegment()[0];
    const elapsed = Math.floor((this.now().getTime() - start.getTime()) / 1000);
    return this.record().remaining - elapsed;
  })
}
