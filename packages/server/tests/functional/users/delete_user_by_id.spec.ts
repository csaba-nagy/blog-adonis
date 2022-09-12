import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import UserFactory from 'Database/factories/UserFactory'
import { DB_CONNECTION, TEST_ADMIN_ID, USER_ACCOUNT_PATH, USER_ACCOUNT_PATH_WITH_ID, USER_PROFILE_PATH }
  from '../../constantsForTests'

test.group('DELETE /users/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should delete user account and profile if the user is an admin',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID) // 👈 this user fires the delete request

      const { id } = await UserFactory.create() // 👈 this is the user that should be deleted, a.k.a targetedUser
      const targetedUserPath = `${USER_ACCOUNT_PATH}/${id}`
      const targetedUserProfilePath = `${USER_PROFILE_PATH}/${id}`

      // Only the admin users can fire this action
      assert.propertyVal(user.$attributes, 'role', UserRole.ADMIN)

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

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.delete(USER_ACCOUNT_PATH_WITH_ID)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)
      const invalidId = 99999
      const response = await client
        .delete(`${USER_ACCOUNT_PATH}/${invalidId}`)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client, assert }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      const { id } = await UserFactory.create() // 👈 this is the user that should be deleted, a.k.a targetedUser
      const targetedUserPath = `${USER_ACCOUNT_PATH}/${id}`

      for (const userRole of unauthorizedUserRoles) {
        // set the TEST_USER role to false value directly. NOTE: The TEST_USER is admin as default
        const user = await User.updateOrCreate({ id: TEST_ADMIN_ID }, { role: userRole })

        assert.propertyVal(user.$attributes, 'role', userRole)

        const response = await client.delete(targetedUserPath).guard('api').loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
