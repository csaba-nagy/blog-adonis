import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DB_CONNECTION, TEST_USER_ID, USER_ACCOUNT_PATH } from '../constantsForTesting'

test.group('GET /account', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return the authenticated user account',
    async ({ client, assert }) => {
      const userToAuth = await User.findOrFail(TEST_USER_ID)

      const userProperties = Object
        .getOwnPropertyNames(userToAuth.$attributes)
        .filter(prop => prop !== 'password') // 👈 We do not need the password property
        .map(prop => string.snakeCase(prop)) // 👈 Need to convert to snake_case

      const response = await client
        .get(USER_ACCOUNT_PATH)
        .guard('api')
        .loginAs(userToAuth)

      response.assertStatus(StatusCodes.OK)
      assert.properties(response.body(), userProperties)
      assert.notProperty(response.body(), 'password')
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client, assert }) => {
      const response = await client.get(USER_ACCOUNT_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      assert.properties(response.body(), ['errors'])
      assert.exists(response.body().errors[0].message)
    })
})
