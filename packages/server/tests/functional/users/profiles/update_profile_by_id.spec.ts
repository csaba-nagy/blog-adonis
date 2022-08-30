import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_USER_ID, USER_PROFILE_PATH, USER_PROFILE_PATH_WITH_ID } from '../../constantsForTesting'

test.group('PATCH /profile/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should update a user profile by id if the user is authenticated',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)

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
    async ({ client, assert }) => {
      const updateProfileData = {
        biography: 'lorem ipsum dolor sit amet',
      }

      const responseWithoutAuth = await client.patch(USER_PROFILE_PATH_WITH_ID).json(updateProfileData)

      responseWithoutAuth.assertStatus(StatusCodes.UNAUTHORIZED)

      assert.properties(responseWithoutAuth.body(), ['errors'])

      responseWithoutAuth.assertTextIncludes('UNAUTHORIZED')
    })

  test('it should return error (404 NOT FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)
      const invalidId = 99999

      const updateProfileData = {
        biography: 'lorem ipsum dolor sit amet',
      }

      const responseWithAuthenticatedUserAndInvalidId = await client
        .patch(`${USER_PROFILE_PATH}/${invalidId}`)
        .json(updateProfileData)
        .guard('api')
        .loginAs(user)

      responseWithAuthenticatedUserAndInvalidId.assertStatus(StatusCodes.NOT_FOUND)
      responseWithAuthenticatedUserAndInvalidId.assertTextIncludes('NOT_FOUND')
    })
})