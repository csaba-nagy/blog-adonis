import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validationErrorMessages } from './shared/customMessages'
import { postValidation } from './shared/validationRules'

export default class PostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    pageTitle: schema.string(postValidation.titleRules),
    title: schema.string(postValidation.titleRules),
    category: schema.enum(postValidation.categoryRules),
    description: schema.string(postValidation.descriptionRules),
    metaDescription: schema.string(postValidation.descriptionRules),
    body: schema.string(postValidation.bodyRules),
    state: schema.enum(postValidation.stateRules),
  })

  public messages: CustomMessages = validationErrorMessages
}
