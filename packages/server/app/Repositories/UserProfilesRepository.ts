import Database from '@ioc:Adonis/Lucid/Database'
import { UserProfile } from 'App/Models'

export class UserProfilesRepository {
  public async getUserProfile(userId) {
    return await UserProfile.findByOrFail('user_id', userId)
  }

  public async updateUserProfile(profileData) {
    const updatedProfile = await Database.transaction(async (trx) => {
      const profile = await UserProfile.findByOrFail('user_id', profileData.userId, { client: trx })

      const updatedProfile = await profile.merge({
        ...profileData,
      }).save()

      return updatedProfile
    })

    return updatedProfile
  }
}
