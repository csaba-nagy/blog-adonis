import type { DateTime } from 'luxon'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { User } from 'App/Models'
import AppBaseModel from './AppBaseModel'

export default class UserProfile extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public avatarUrl: string | null

  @column()
  public biography: string | null

  @column()
  public websiteUrl: string | null

  @column()
  public facebookUrl: string | null

  @column()
  public twitterUrl: string | null

  @column()
  public instagramUrl: string | null

  @column()
  public youtubeUrl: string | null

  @column()
  public githubUrl: string | null

  @column()
  public linkedinUrl: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
