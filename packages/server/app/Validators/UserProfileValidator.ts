import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UserProfileValidator {
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
    avatarUrl: schema.string.nullableAndOptional({}, [
      rules.minLength(10),
      rules.maxLength(250),
    ]),
    biography: schema.string.nullableAndOptional({}, [
      rules.minLength(5),
      rules.maxLength(1000),
    ]),
    websiteUrl: schema.string.nullableAndOptional({}, [
      rules.url({
        protocols: ['https'],
      }),
    ]),
    facebookUrl: schema.string.nullableAndOptional({}, [
      rules.url({
        protocols: ['https'],
        allowedHosts: ['facebook.com'],
      }),
    ]),
    twitterUrl: schema.string.nullableAndOptional({}, [
      rules.url({
        protocols: ['https'],
        allowedHosts: ['twitter.com'],
      }),
    ]),
    instagramUrl: schema.string.nullableAndOptional({}, [
      rules.url({
        protocols: ['https'],
        allowedHosts: ['instagram.com'],
      }),
    ]),
    youtubeUrl: schema.string.nullableAndOptional({}, [
      rules.url({
        protocols: ['https'],
        allowedHosts: ['youtube.com'],
      }),
    ]),
    githubUrl: schema.string.nullableAndOptional({}, [
      rules.url({
        protocols: ['https'],
        allowedHosts: ['github.com'],
      }),
    ]),
    linkedinUrl: schema.string.nullableAndOptional({}, [
      rules.url({
        protocols: ['https'],
        allowedHosts: ['linkedin.com'],
      }),
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
  public messages: CustomMessages = {}
}
