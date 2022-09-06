import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_ADMIN_ID, USER_PROFILE_PATH, USER_PROFILE_PATH_WITH_ID } from '../../../constantsForTests'

test.group('PATCH /profile/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should update a user profile by id if the user is authenticated',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const payload = {
        biography: 'lorem ipsum dolor sit amet',
      }

      const preUpdateData = await client.get(USER_PROFILE_PATH_WITH_ID)
      const { updated_at } = preUpdateData.body()

      const response = await client.patch(USER_PROFILE_PATH_WITH_ID)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.notPropertyVal(response.body(), 'updated_at', updated_at)

      assert.propertyVal(response.body(), 'biography', payload.biography)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const updateProfileData = {
        biography: 'lorem ipsum dolor sit amet',
      }

      const response = await client.patch(USER_PROFILE_PATH_WITH_ID).json(updateProfileData)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)
      const invalidId = 99999

      const updateProfileData = {
        biography: 'lorem ipsum dolor sit amet',
      }

      const response = await client
        .patch(`${USER_PROFILE_PATH}/${invalidId}`)
        .json(updateProfileData)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
})
