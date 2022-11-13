import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validationErrorMessages } from './shared/customMessages'
import { userProfileValidation } from './shared/validationRules'

export default class UserProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    avatarUrl: schema.string.nullable(),
    biography: schema.string.nullable(userProfileValidation.biographyRules),
    websiteUrl: schema.string.nullable(userProfileValidation.getWebsiteUrlRules()),
    facebookUrl: schema.string.nullable(userProfileValidation.getUrlRulesWithAllowedHosts(['facebook.com'])),
    twitterUrl: schema.string.nullable(userProfileValidation.getUrlRulesWithAllowedHosts(['twitter.com'])),
    instagramUrl: schema.string.nullable(userProfileValidation.getUrlRulesWithAllowedHosts(['instagram.com'])),
    youtubeUrl: schema.string.nullable(userProfileValidation.getUrlRulesWithAllowedHosts(['youtube.com'])),
    githubUrl: schema.string.nullable(userProfileValidation.getUrlRulesWithAllowedHosts(['github.com'])),
    linkedinUrl: schema.string.nullable(userProfileValidation.getUrlRulesWithAllowedHosts(['linkedin.com'])),
  })

  public messages: CustomMessages = validationErrorMessages
}
