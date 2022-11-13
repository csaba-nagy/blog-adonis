import { UserRole } from 'App/Enums'
import type { User } from 'App/Models'
import BasePolicy from 'App/Policies/BasePolicy'

export default class UserProfilePolicy extends BasePolicy {
  public updateProfileById = (user: User, targetId: number) =>
    user.id === targetId || user.role === UserRole.ADMIN

  public showProfileById = (_: User) => true
}
