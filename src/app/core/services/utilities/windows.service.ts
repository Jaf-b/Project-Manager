import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowsService {
  width = signal(window.innerWidth);
  constructor() {
    const obs = new ResizeObserver((entries) => {
      const bboxsize = entries[0].borderBoxSize;
      this.width.set(bboxsize[0].inlineSize);
    }).observe(document.body);
  }
}
