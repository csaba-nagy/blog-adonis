import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_ADMIN_ID, USER_PROFILE_PATH } from 'Shared/const'

test.group('PATCH /profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should update the authenticated user profile',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const payload = {
        biography: 'lorem ipsum dolor sit amet',
      }

      const preUpdateData = await client.get(USER_PROFILE_PATH)
        .guard('api')
        .loginAs(user)

      const { updated_at } = preUpdateData.body()

      const response = await client
        .patch(USER_PROFILE_PATH)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)
      assert.notPropertyVal(response.body(), 'updated_at', updated_at)
      assert.propertyVal(response.body(), 'biography', payload.biography)
    })

  test('it should return an error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USER_PROFILE_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })
})
