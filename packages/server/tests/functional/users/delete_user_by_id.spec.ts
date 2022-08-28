import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import UserFactory from 'Database/factories/UserFactory'
import { DB_CONNECTION, TEST_USER_ID, USERS_PATH, USER_PATH_WITH_ID, USER_PROFILE_PATH } from '../constantsForTesting'

test.group('DELETE /users/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should delete user account and profile if the user is authenticated',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID) // 👈 this user fires the delete request

      const { id } = await UserFactory.create() // 👈 this is the user that should be deleted, a.k.a targetedUser
      const targetedUserPath = `${USERS_PATH}/${id}`
      const targetedUserProfilePath = `${USER_PROFILE_PATH}/${id}`

      const response = await client
        .delete(targetedUserPath)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      const responseToGetDeletedUser = await client
        .get(targetedUserPath)
        .guard('api')
        .loginAs(user)

      responseToGetDeletedUser.assertStatus(StatusCodes.NOT_FOUND)

      const responseToGetDeletedProfile = await client
        .get(targetedUserProfilePath)
        .guard('api')
        .loginAs(user)

      responseToGetDeletedProfile.assertStatus(StatusCodes.NOT_FOUND)
    })

  test('it should return error if the user is not authenticated',
    async ({ client, assert }) => {
      const response = await client.delete(USER_PATH_WITH_ID)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      assert.properties(response.body(), ['errors'])
      assert.exists(response.body().errors[0].message)
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)
      const invalidId = 99999
      const response = await client
        .delete(`${USERS_PATH}/${invalidId}`)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
})
