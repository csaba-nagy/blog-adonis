import { UserRole } from 'App/Enums'
import type { User } from 'App/Models'
import BasePolicy from 'App/Policies/BasePolicy'

export default class UserPolicy extends BasePolicy {
  public getAllUsers = (user: User) => user.role === UserRole.ADMIN

  public getUserById = (user: User, targetId: number) =>
    user.id === targetId || user.role === UserRole.ADMIN

  public updateUserById = (user: User, targetId: number) =>
    user.id === targetId || user.role === UserRole.ADMIN

  public deleteUserById = (user: User, targetId: number) =>
    user.id === targetId || user.role === UserRole.ADMIN
}
