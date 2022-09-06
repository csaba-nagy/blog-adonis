import { Exception } from '@adonisjs/core/build/standalone'
import { StatusCodes } from 'App/Enums'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new InvalidCredentialException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export class InvalidCredentialException extends Exception {
  constructor() {
    super('Invalid credentials', StatusCodes.UNAUTHORIZED, 'E_AUTHENTICATION_FAILURE')
  }
}
