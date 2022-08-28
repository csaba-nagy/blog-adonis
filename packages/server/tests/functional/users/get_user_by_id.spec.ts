import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes } from 'App/Enums'
import { string } from '@ioc:Adonis/Core/Helpers'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_USER_ID, USERS_PATH, USER_PATH_WITH_ID } from '../constantsForTesting'

test.group('GET /users/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return a valid user account if the user is authenticated',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const requiredUserProperties = Object
        .getOwnPropertyNames(user.$attributes)
        .filter(prop => prop !== 'password') // 👈 We do not need the password property
        .map(prop => string.snakeCase(prop)) // 👈 Need to convert to snake_case

      const response = await client
        .get(USER_PATH_WITH_ID)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.properties(response.body(), requiredUserProperties)

      assert.notProperty(response.body(), 'password')

      assert.propertyVal(response.body(), 'id', TEST_USER_ID)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client, assert }) => {
      const response = await client.get(USER_PATH_WITH_ID)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      assert.properties(response.body(), ['errors'])
      assert.exists(response.body().errors[0].message)
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)
      const invalidId = 99999
      const response = await client
        .get(`${USERS_PATH}/${invalidId}`)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
})
