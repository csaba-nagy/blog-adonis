import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { userDataValidation } from './shared/validationRules'
import { validationErrorMessages } from './shared/customMessages'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string({}, userDataValidation.firstNameRules),
    lastName: schema.string({}, userDataValidation.lastNameRules),
    email: schema.string({}, userDataValidation.getEmailRules()),
    password: schema.string({}, userDataValidation.passwordRules),
  })

  public messages: CustomMessages = validationErrorMessages
}
