import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IStateProps } from '../../utils';

@Injectable({
  providedIn: 'root',
})


export class StateService {
  stateSubject = new BehaviorSubject<IStateProps>({ loader: false, error: null, statusCode: null, success: null });
  state$ = this.stateSubject.asObservable();

  get stateValue(): IStateProps {
    return this.stateSubject.getValue();
  }

  showLoader(): void {
    const currentState = this.stateValue;
    this.stateSubject.next({ ...currentState, loader: true})

  }

  hideLoader(): void {
    const currentState = this.stateValue;
    this.stateSubject.next({ ...currentState, loader: false})
  }

  setError(error: string | null, statusCode: number | null): void {
    const currentState = this.stateValue;
    this.stateSubject.next({ ...currentState, error, statusCode})
  }

  setSuccess(success: string | null, statusCode: number | null): void {
    const currentState = this.stateValue;
    this.stateSubject.next({ ...currentState, success, statusCode})
  }

  resetSuccessAndError(): void {
    const currentState = this.stateValue;
    this.stateSubject.next({ ...currentState, error: null, statusCode: null, success: null})
  }

}
