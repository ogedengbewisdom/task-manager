import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { ErrorHandler } from '../../tasks/services/error-handler';
import { StateService } from '../../tasks/services/state-service';

export const handleErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorHandler);
  const stateService = inject(StateService);

  stateService.showLoader();
  return next(req).pipe(catchError((error) => {
    const handledError = errorService.handleError(error);
    return throwError(() => handledError)
  }), finalize(() => stateService.hideLoader()));
};
