import { test } from '@japa/runner'
import { StatusCodes, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import UserFactory from 'Database/factories/UserFactory'
import {
  TEST_ADMIN_ID,
  TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'

test.group('DELETE /users/:id', (group) => {
  group.each.setup(setTransaction)

  test('it should delete user account and profile, if the logged user role is admin',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID) // 👈 this user fires the delete request

      const { id: targetedId } = await UserFactory.with('profile').create() // 👈 this is the user that should be deleted, a.k.a targetedUser
      const path = Route.makeUrl('users.destroy', { id: targetedId })

      const response = await client
        .delete(path)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NO_CONTENT)

      // Testing the deleted user route 👇
      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const responseToGetDeletedUser = await client
        .get(path)
        .guard('api')
        .loginAs(admin)

      responseToGetDeletedUser.assertStatus(StatusCodes.NOT_FOUND)

      // Testing the deleted user profile route 👇
      const targetedUserProfilePath = Route.makeUrl('profiles.show', { id: targetedId })

      const responseToGetDeletedProfile = await client
        .get(targetedUserProfilePath)
        .guard('api')
        .loginAs(admin)

      responseToGetDeletedProfile.assertStatus(StatusCodes.NOT_FOUND)
    })

  test('it should delete the user and its profile, if the logged user id and the targeted id are the same',
    async ({ client }) => {
      const user = await UserFactory.with('profile').create()

      const path = Route.makeUrl('users.destroy', { id: user.id })
      const profilePath = Route.makeUrl('profiles.show', { id: user.id })

      const response = await client
        .delete(path)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NO_CONTENT)

      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const responseToGetDeletedUser = await client
        .get(path)
        .guard('api')
        .loginAs(admin)

      responseToGetDeletedUser.assertStatus(StatusCodes.NOT_FOUND)

      const responseToGetDeletedProfile = await client
        .get(profilePath)
        .guard('api')
        .loginAs(admin)

      responseToGetDeletedProfile.assertStatus(StatusCodes.NOT_FOUND)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const path = Route.makeUrl('users.destroy', { id: TEST_USER_ID })
      const response = await client.delete(path)

      response.assertStatus(StatusCodes.UNAUTHORIZED)
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const invalidId = 99999
      const path = Route.makeUrl('users.destroy', { id: invalidId })

      const response = await client
        .delete(path)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })

  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      const { id: targetedUserId } = await UserFactory.with('profile').create() // 👈 this is the user that should be deleted, a.k.a targetedUser
      const path = Route.makeUrl('users.destroy', { id: targetedUserId })

      for (const userRole of unauthorizedUserRoles) {
        const user = await User.findByOrFail('role', userRole)

        const response = await client.delete(path).guard('api').loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
