import Database from '@ioc:Adonis/Lucid/Database'
import { UserProfile } from 'App/Models'

export default class UserProfilesRepository {
  public getUserProfile = async (userId: number) => await UserProfile.findByOrFail('user_id', userId)

  public async updateUserProfile(profileDataWithUserId) {
    return await Database.transaction(async (trx) => {
      const { userId: id, data: profileData } = profileDataWithUserId
      const profile = await UserProfile.findByOrFail('user_id', id, { client: trx })

      return await profile.merge({
        ...profileData,
      }).save()
    })
  }
}
