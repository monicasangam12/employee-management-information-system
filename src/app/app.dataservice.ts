import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _messageSource = new BehaviorSubject<string>('Initial Message'); // Initial value is required
  currentMessage: Observable<string> = this._messageSource.asObservable();

  constructor() {
    
   }

  changeMessage(message: string) {
    this._messageSource.next(message);
  }
}