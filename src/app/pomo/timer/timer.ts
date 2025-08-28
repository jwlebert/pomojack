import { Component, computed, effect, Pipe, PipeTransform, signal, WritableSignal } from '@angular/core';

// class TimeRecord {
//   duration: number;
//   remaining: number;
//   public elapsed = computed(() => this.duration - this.remaining);
//   segments: [Date, Date?][];

//   public constructor(duration = 20 * 60) {
//     this.duration = duration;
//     this.remaining = duration;
//     this.segments = [];
//   }

//   public startSegment() {
//     this.segments = [...this.segments, [new Date(), undefined]];
//   }

//   public endSegment() {

//   }
// }

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
  public duration = 20 * 60;
  private start = signal(new Date());

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
    this.active.set(true);
    this.now.set(new Date());
    this.start.set(new Date());
  }

  public timeLeft = computed(() => {
    const elapsed = this.now().getSeconds() - this.start().getSeconds();
    return this.duration - elapsed;
  })
}
