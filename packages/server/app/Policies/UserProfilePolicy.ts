import { UserRole } from 'App/Enums'
import type { User, UserProfile } from 'App/Models'
import BasePolicy from 'App/Policies/BasePolicy'

export default class UserProfilePolicy extends BasePolicy {
  public updateUserProfileById(user: User) {
    if (user.role !== UserRole.ADMIN)
      return false
  }

  public viewOwnProfile(user: User, profile: UserProfile) {
    return profile.userId === user.id
  }

  public updateOwnProfile(user: User, profile: UserProfile) {
    return profile.userId === user.id
  }

  public viewProfileById(_: User) {
    return true
  }
}