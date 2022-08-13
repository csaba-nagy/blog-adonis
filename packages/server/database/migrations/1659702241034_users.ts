import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { UserRole, UserStatus } from 'App/Enums'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('email', 100).notNullable().unique()
      table.string('password', 1024).notNullable()
      table.enum('role', Object.values(UserRole)).notNullable().defaultTo(UserRole.USER)
      table.enum('status', Object.values(UserStatus)).notNullable().defaultTo(UserStatus.PENDING)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
