import type { DateTime } from 'luxon'
import type { HasMany, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { beforeSave, column, computed, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import type { UserRole, UserStatus } from 'App/Enums'
import { Comment, Post, UserProfile } from 'App/Models'
import { DOMAIN, USER_ACCOUNT_PATH, USER_PROFILE_PATH } from 'Shared/const'
import AppBaseModel from './AppBaseModel'

export default class User extends AppBaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @computed({ serializeAs: 'profile' })
  public get profileLink() {
    return `${DOMAIN}${USER_PROFILE_PATH}/${this.id}`
  }

  @computed({ serializeAs: 'account' })
  public get accountLink() {
    return `${DOMAIN}${USER_ACCOUNT_PATH}/${this.id}`
  }

  @column({ serializeAs: null })
  public firstName: string

  @column({ serializeAs: null })
  public lastName: string

  @computed({ serializeAs: 'name' })
  public get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: UserRole

  @column()
  public status: UserStatus

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => value ? value.setZone('utc').toISO() : value,
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => value ? value.setZone('utc').toISO() : value,
  })
  public updatedAt: DateTime

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasMany(() => Post, {
    foreignKey: 'userId',
  })
  public posts: HasMany<typeof Post>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password)
      user.password = await Hash.make(user.password)
  }
}
