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

export const userProfileValidation = {
  getWebsiteUrlRules(allowedProtocols: ('https' | 'http')[] = ['https', 'http']) {
    return [
      rules.url({ protocols: allowedProtocols }),
    ]
  },
  getUrlRulesWithAllowedHosts(hosts: string[], allowedProtocols: ('https' | 'http')[] = ['https']) {
    return [
      rules.url({ protocols: allowedProtocols, allowedHosts: hosts }),
    ]
  },
  get biographyRules() {
    return [
      rules.minLength(5),
      rules.maxLength(1000),
    ]
  },
}
