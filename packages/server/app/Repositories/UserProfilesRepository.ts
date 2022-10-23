import Database from '@ioc:Adonis/Lucid/Database'
import type { ModelAdapterOptions } from '@ioc:Adonis/Lucid/Orm'
import { UserProfile } from 'App/Models'

export default class UserProfilesRepository {
  public getUserProfileByUserId = (userId: number, options?: ModelAdapterOptions) =>
    UserProfile.findByOrFail('user_id', userId, options)

  public updateUserProfile = (profile: UserProfile, payload) =>
    Database.transaction(trx => profile.useTransaction(trx).merge(payload).save())
}
