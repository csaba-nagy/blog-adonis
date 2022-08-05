import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').references('id').inTable('users').notNullable()
      table.text('avatar_url').nullable()
      table.text('biography').nullable()
      table.text('website_url').nullable()
      table.text('facebook_url').nullable()
      table.text('twitter_url').nullable()
      table.text('instagram_url').nullable()
      table.text('youtube_url').nullable()
      table.text('github_url').nullable()
      table.text('linkedin_url').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
