import { rules } from '@ioc:Adonis/Core/Validator'

export const userDataValidation = {
  get firstNameRules() {
    return [
      rules.minLength(2),
      rules.maxLength(50),
      rules.alpha(),
      rules.trim(),
    ]
  },
  get lastNameRules() {
    return [
      rules.minLength(2),
      rules.maxLength(50),
      rules.alpha(),
      rules.trim(),
    ]
  },
  getEmailRules(refs?) {
    return [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
        whereNot: refs ? { id: refs } : undefined,
      }),
      rules.maxLength(100),
      rules.trim(),
    ]
  },
  get passwordRules() {
    return [
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    ]
  },
}
