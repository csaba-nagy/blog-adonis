import type { DateTime } from 'luxon'
import type { HasMany, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import type { UserRole, UserStatus } from '../Enums'
import UserProfile from './UserProfile'
import Post from './Post'
import Comment from './Comment'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public role: UserRole

  @column()
  public status: UserStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasMany(() => Post, {
    foreignKey: 'authorId',
  })
  public posts: HasMany<typeof Post>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}
