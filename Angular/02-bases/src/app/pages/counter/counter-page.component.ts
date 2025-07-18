import { Component, signal } from "@angular/core";

@Component({
  templateUrl: "./counter-page.component.html",
  styles: `
    button {
      padding: 5px;
      margin: 5px 10px;
      width: 75px;
    }
  `
})

export class CounterPageComponent {
  counter = 10;
  counterSignal = signal(10);

  public increaseBy(value: number): void {
    this.counter += value;
    //this.counterSignal.set(this.counterSignal() + value);
    this.counterSignal.update(current => current + value);
  }

  public resetCounter(): void {
    this.counter = 0;
    this.counterSignal.set(0);
  }
}
