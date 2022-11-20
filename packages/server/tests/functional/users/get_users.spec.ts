import { test } from '@japa/runner'
import { StatusCodes, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import { TEST_ADMIN_ID } from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'
import { getAllUsers } from 'Tests/helpers/getAllUsers'

test.group('GET /users', (group) => {
  group.each.setup(setTransaction)

  test('it should return all users if the user is authenticated and authorized (admin only)',
    async ({ client, assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const requiredProperties = ['id', 'email', 'role', 'status', 'profile', 'account', 'name']

      const users = await getAllUsers(client, admin)

      users.forEach((user) => {
        assert.properties(user, requiredProperties)

        assert.notProperty(user, 'password')
      })
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const path = Route.makeUrl('users.index')
      const response = await client.get(path)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]
      const path = Route.makeUrl('users.index')

      for (const userRole of unauthorizedUserRoles) {
        const user = await User.findByOrFail('role', userRole)

        const response = await client.get(path).guard('api').loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
