import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { AUTH_LOGOUT_PATH, DB_CONNECTION } from '../users/constantsForTesting'

test.group('Log out', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })
  test('GET /logout', async ({ client }) => {
    const response = await client.get(AUTH_LOGOUT_PATH)

    response.assertStatus(StatusCodes.OK)
    response.assertBody({ revoked: true })
  })
})
