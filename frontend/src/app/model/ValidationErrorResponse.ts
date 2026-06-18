import {FieldError} from './FieldError';

export interface ValidationErrorResponse {
  message: string;
  errors: FieldError[];
}
