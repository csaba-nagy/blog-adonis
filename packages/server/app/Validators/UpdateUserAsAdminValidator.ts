import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { userDataValidationAsAdmin } from './shared/validationRules'
import { validationErrorMessages } from './shared/customMessages'

export default class UpdateUserAsAdminValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create(userDataValidationAsAdmin)

  public messages: CustomMessages = validationErrorMessages
}
