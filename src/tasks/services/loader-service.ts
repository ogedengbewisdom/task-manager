import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loaderSubject = new BehaviorSubject<boolean>(false);
  loader$ = this.loaderSubject.asObservable();
  private requestCount = 0;

  showLoader(): void {

    setTimeout(() => {
      this.requestCount++;
      if (this.requestCount === 1) {
        this.loaderSubject.next(true);
      }
    }, 0)

  }

  hideLoader(): void {
    setTimeout(() => {
      this.requestCount--
      if (this.requestCount === 0) {
        this.loaderSubject.next(false);
      }
    }, 0)
  }
}
