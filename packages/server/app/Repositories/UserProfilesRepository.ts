import Database from '@ioc:Adonis/Lucid/Database'
import type { ModelAdapterOptions } from '@ioc:Adonis/Lucid/Orm'
import { UserProfile } from 'App/Models'

export default class UserProfilesRepository {
  public getUserProfileByUserId = (userId: number, options?: ModelAdapterOptions) =>
    UserProfile.findByOrFail('user_id', userId, options)

  public updateUserProfile = (id: number, payload) => {
    return Database.transaction(async (trx) => {
      const profile = await this.getUserProfileByUserId(id, { client: trx })

      return profile.merge(payload).save()
    })
  }
}
