import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PostCategory, PostState } from 'App/Enums'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('page_title', 100).notNullable()
      table.string('title', 100).notNullable()
      table.string('slug', 100).notNullable().unique()
      table.enum('category', Object.values(PostCategory)).notNullable()
      table.integer('user_id').references('id').inTable('users').unsigned().nullable().onDelete('SET NULL')
      table.text('description').notNullable()
      table.text('meta_description').nullable()
      table.text('body').notNullable()
      table.enum('state', Object.values(PostState)).notNullable().defaultTo(PostState.DRAFT)
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.timestamp('published_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.index('slug')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
