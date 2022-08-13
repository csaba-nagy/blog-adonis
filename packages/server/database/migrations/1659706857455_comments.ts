import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').unsigned().notNullable().onDelete('CASCADE')
      table.integer('post_id').references('id').inTable('posts').unsigned().notNullable().onDelete('CASCADE')
      table.integer('reply_to').references('id').inTable('comments').unsigned().nullable().onDelete('CASCADE')
      table.string('body').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
