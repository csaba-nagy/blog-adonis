import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes } from 'App/Enums'
import { DB_CONNECTION, USERS_PATH } from './constantsForTesting'

test.group('Get users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })
  test('GET /users', async ({ client, assert }) => {
    const response = await client.get(USERS_PATH)

    // Expected Status Code is 200
    response.assertStatus(StatusCodes.OK)

    // During the seeding process, 11 user has been created.
    assert.lengthOf(response.body(), 11)

    // Check that all the necessary user properties have been returned
    response
      .body()
      .forEach(
        (user) => {
          assert.properties(user, ['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at', 'updated_at'])

          // Returning the password is not allowed
          assert.notProperty(user, 'password')
        })
  })
})
