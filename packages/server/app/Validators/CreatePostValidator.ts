import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PostCategory, PostState } from 'App/Enums'

export default class CreatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    pageTitle: schema.string({}, [
      rules.minLength(3),
      rules.maxLength(100),
    ]),
    title: schema.string({}, [
      rules.minLength(5),
      rules.maxLength(100),
    ]),
    category: schema.enum(Object.values(PostCategory)),
    description: schema.string({}, [
      rules.minLength(5),
      rules.maxLength(250),
    ]),
    metaDescription: schema.string({}, [
      rules.minLength(5),
      rules.maxLength(250),
    ]),
    body: schema.string({}, [
      rules.minLength(20),
    ]),
    state: schema.enum(Object.values(PostState)),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',
    minLength: '{{ field }} should be at least {{ options.minLength }} characters long.',
    maxLength: '{{ field }} cannot be longer than {{ options.maxLength }} characters.',
  }
}
