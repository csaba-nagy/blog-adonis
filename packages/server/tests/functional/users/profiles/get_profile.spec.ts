import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { DB_CONNECTION, TEST_USER_ID, USER_PROFILE_PATH_WITH_ID } from '../constantsForTesting'

test.group('Get user profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('GET /users/profile/:id', async ({ client, assert }) => {
    const response = await client.get(USER_PROFILE_PATH_WITH_ID)

    response.assertStatus(StatusCodes.OK)

    assert.propertyVal(response.body(), 'user_id', TEST_USER_ID)
  })
})
