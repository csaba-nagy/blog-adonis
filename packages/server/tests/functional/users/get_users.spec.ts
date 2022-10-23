import { test } from '@japa/runner'
import { StatusCodes, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import { TEST_ADMIN_ID, USERS_PATH_PREFIX } from 'Shared/const'
import { setTransaction } from 'Tests/helpers'

test.group('GET /users', (group) => {
  group.each.setup(setTransaction)

  test('it should return all users if the user is authenticated and authorized',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const response = await client.get(USERS_PATH_PREFIX).guard('api').loginAs(user)

      response.assertStatus(StatusCodes.OK)

      // Only the admin users can fire this action
      assert.propertyVal(user.$attributes, 'role', UserRole.ADMIN)

      response.body().forEach((user) => {
        assert.properties(
          user,
          ['id', 'email', 'role', 'status', 'profile', 'account', 'name'],
        )

        assert.notProperty(user, 'password')
      })
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USERS_PATH_PREFIX)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      for (const userRole of unauthorizedUserRoles) {
        const user = await User.findByOrFail('role', userRole)

        const response = await client.get(USERS_PATH_PREFIX).guard('api').loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
