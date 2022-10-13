import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User, UserProfile } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DB_CONNECTION, TEST_ADMIN_ID, USER_PROFILE_PATH } from 'Shared/const'

test.group('GET /profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return the authenticated user profile',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)
      const userProfile = await UserProfile.findByOrFail('user_id', user.id)

      // need to convert the given camelCase property names to snake_case
      // TODO: refactor the migration and a base model cases into a unified case
      const userProfileProperties = Object.getOwnPropertyNames(userProfile.$attributes)
        .map(prop => string.snakeCase(prop))

      const response = await client
        .get(USER_PROFILE_PATH)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.propertyVal(response.body(), 'user_id', TEST_ADMIN_ID)
      assert.properties(response.body(), userProfileProperties)
    })

  test('it should return an error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USER_PROFILE_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })
})
