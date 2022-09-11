import Database from '@ioc:Adonis/Lucid/Database'
import { UserProfile } from 'App/Models'

export default class UserProfilesRepository {
  public async getUserProfile(userId) {
    return await UserProfile.findByOrFail('user_id', userId)
  }

  public async updateUserProfile(profileDataWithUserId) {
    const updatedProfile = await Database.transaction(async (trx) => {
      const { userId: id, data: profileData } = profileDataWithUserId

      const profile = await UserProfile.findByOrFail('user_id', id, { client: trx })

      const updatedProfile = await profile.merge({
        ...profileData,
      }).save()

      return updatedProfile
    })

    return updatedProfile
  }
}
