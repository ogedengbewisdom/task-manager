import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { CustomError } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandler {
  handleError (error: HttpErrorResponse) {
    let errorMessage = 'Oops! Something went wrong. Please try again';
    if (error.status === 400) {
      errorMessage = 'Bad Request: Please check your input data';
    }
    else if (error.status === 401) {
      errorMessage = 'Unauthorized: Please login to continue';
    }
    else if (error.status === 403) {
      errorMessage = 'Forbidden: You are not authorized to access this resource';
    }
    else if (error.status === 404) {
      errorMessage = 'Not Found: The requested resource was not found';
    }
    else if (error.status === 500) {
      errorMessage = 'Internal Server Error: Please try again later';
    }

    return new CustomError(errorMessage, error.status, error); 
  }
}
