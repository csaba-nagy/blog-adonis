import { UserRole } from 'App/Enums'
import type { User } from 'App/Models'
import BasePolicy from 'App/Policies/BasePolicy'

export default class UserPolicy extends BasePolicy {
  public async getAllUsers(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }

  public async getUserById(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }

  public async updateUserById(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }

  public async deleteUserById(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }
}
