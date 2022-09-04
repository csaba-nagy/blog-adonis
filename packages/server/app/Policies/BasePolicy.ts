import { BasePolicy as BouncerBasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { UserRole } from 'App/Enums'
import type { User } from 'App/Models'

export default class BasePolicy extends BouncerBasePolicy {
  public async before(user: User | null) {
    if (user?.role === UserRole.ADMIN)
      return true

    return undefined // 👈 Should return "undefined"
    // if you want Bouncer to execute the next hook or the action callback
    // https://docs.adonisjs.com/guides/authorization#before-hook
  }
}
