import { UserRole } from 'App/Enums'
import type { User } from 'App/Models'
import BasePolicy from 'App/Policies/BasePolicy'

export default class UserPolicy extends BasePolicy {
  public getAllUsers(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }

  public getUserById(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }

  public updateUserById(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }

  public deleteUserById(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }
}
