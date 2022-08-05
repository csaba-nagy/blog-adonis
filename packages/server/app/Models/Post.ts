import type { DateTime } from 'luxon'
import type { BelongsTo, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import type { PostCategory, PostState } from '../Enums'
import { Asset, User } from '.'

export class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pageTitle: string

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public category: PostCategory

  @column()
  public authorId: number

  @column()
  public description: string

  @column()
  public metaDescription: string

  @column()
  public body: string

  @column()
  public state: PostState

  @column()
  public isFeatured: boolean

  @column.dateTime()
  public publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Asset, {
    pivotTable: 'asset_posts',
  })
  public assets: ManyToMany<typeof Asset>
}
