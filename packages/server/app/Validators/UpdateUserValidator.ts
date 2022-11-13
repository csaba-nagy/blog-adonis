import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserRole, UserStatus } from 'App/Enums'
import { userDataValidation } from './shared/validationRules'
import { validationErrorMessages } from './shared/customMessages'

export default class UpdateUserValidator {
  public schema

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  constructor(protected ctx: HttpContextContract) {
    let data: Parameters<typeof schema.create>[0] = {
      firstName: schema.string.optional(userDataValidation.firstNameRules),
      lastName: schema.string.optional(userDataValidation.lastNameRules),
      email: schema.string.optional(userDataValidation.getEmailRules(this.refs.id)),
      password: schema.string.optional(userDataValidation.passwordRules),
    }

    const { auth } = this.ctx

    if (auth.user?.role === UserRole.ADMIN) {
      data = {
        ...data,
        role: schema.enum.optional(Object.values(UserRole)),
        status: schema.enum.optional(Object.values(UserStatus)),
      }
    }

    this.schema = schema.create(data)
  }

  public messages: CustomMessages = validationErrorMessages
}
