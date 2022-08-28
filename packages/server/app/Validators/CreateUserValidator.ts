import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    firstName: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(50),
      rules.alpha(),
    ]),
    lastName: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(50),
      rules.alpha(),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(100),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'firstName.required': 'First name is required',
    'lastName.required': 'Last name is required',
    'email.required': 'Email address is required',
    'password.required': 'Password is required',
    'email.unique': 'Invalid email address',
  }
}
