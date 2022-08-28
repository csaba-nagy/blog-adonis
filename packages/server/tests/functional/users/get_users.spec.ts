import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_USER_ID, USERS_PATH } from '../constantsForTesting'

test.group('GET /users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return all users if the user is authenticated',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)
      const response = await client.get(USERS_PATH).guard('api').loginAs(user)

      response.assertStatus(StatusCodes.OK)

      response.body().forEach((user) => {
        assert.properties(
          user,
          ['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at', 'updated_at'],
        )

        assert.notProperty(user, 'password')
      })
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client, assert }) => {
      const response = await client.get(USERS_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      assert.properties(response.body(), ['errors'])
      assert.exists(response.body().errors[0].message)
    })
})
