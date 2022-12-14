import type { DateTime } from 'luxon'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { User } from 'App/Models'
import AppBaseModel from './AppBaseModel'

export default class Comment extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public postId: number

  @column()
  public replyTo: number | null

  @column()
  public body: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
