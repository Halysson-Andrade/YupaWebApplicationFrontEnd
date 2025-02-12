import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private returnToParentSource = new Subject<void>();
  returnToParent$ = this.returnToParentSource.asObservable();

  triggerReturnToParent() {
    this.returnToParentSource.next();
  }
}