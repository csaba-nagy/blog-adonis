import type { DateTime } from 'luxon'
import type { BelongsTo, ManyToMany, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, belongsTo, column, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'
import type { PostCategory } from 'App/Enums'
import { PostState } from 'App/Enums'
import { Asset, User } from 'App/Models'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Post extends BaseModel {
  public static table = 'posts'

  @column({ isPrimary: true })
  public id: number

  @column({ serialize: (value: string | null) => value ? `${value} | blog-adonis` : null })
  public pageTitle: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
    allowUpdates: true,
  })
  public slug: string

  @column()
  public title: string

  @column()
  public category: PostCategory

  @column()
  public userId: number

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

  @column.dateTime(
    { serialize: (value: DateTime | null) => value?.setZone('utc').toRFC2822() },
  )
  public publishedAt: DateTime | null

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => value?.setZone('utc').toRFC2822(),
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => value?.setZone('utc').toRFC2822(),
  })
  public updatedAt: DateTime

  @belongsTo(() => User, { serializeAs: 'author' })
  public user: BelongsTo<typeof User>

  @manyToMany(() => Asset, {
    pivotTable: 'asset_posts',
  })
  public assets: ManyToMany<typeof Asset>

  public static published = scope((query: ModelQueryBuilderContract<typeof Post>) => {
    query.where('state', '=', PostState.PUBLIC)
    query.withScopes(scopes => scopes.orderedByPublicationDate())
  })

  public static visibleTo = scope((query: ModelQueryBuilderContract<typeof Post>, user: User) => {
    query.where('user_id', user.id)
    query.withScopes(scopes => scopes.orderedByPublicationDate())
  })

  public static orderedByPublicationDate = scope((query) => {
    query.orderBy('published_at', 'desc')
  })
}
