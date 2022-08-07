import type { DateTime } from 'luxon'
import type { ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { Post } from '.'

export class Asset extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fileName: string

  @column()
  public alterText: string | null

  @column()
  public byteSize: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Post, {
    pivotTable: 'asset_posts',
  })
  public posts: ManyToMany<typeof Post>
}
