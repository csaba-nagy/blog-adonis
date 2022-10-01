import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PostCategory, PostState } from 'App/Enums'

export default class UpdatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    pageTitle: schema.string.nullableAndOptional({}, [
      rules.minLength(3),
      rules.maxLength(100),
    ]),
    title: schema.string.nullableAndOptional({}, [
      rules.minLength(5),
      rules.maxLength(100),
    ]),
    category: schema.enum.nullableAndOptional(Object.values(PostCategory)),
    description: schema.string.nullableAndOptional({}, [
      rules.minLength(5),
      rules.maxLength(250),
    ]),
    metaDescription: schema.string.nullableAndOptional({}, [
      rules.minLength(5),
      rules.maxLength(250),
    ]),
    body: schema.string.nullableAndOptional({}, [
      rules.minLength(20),
    ]),
    state: schema.enum.nullableAndOptional(Object.values(PostState)),
  })

  public messages: CustomMessages = {}
}
