import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_ADMIN_ID, USERS_PATH } from '../../constantsForTests'

test.group('GET /users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return all users if the user is authenticated and authorized',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const response = await client.get(USERS_PATH).guard('api').loginAs(user)

      response.assertStatus(StatusCodes.OK)

      // Only the admin users can fire this action
      assert.propertyVal(user.$attributes, 'role', UserRole.ADMIN)

      response.body().forEach((user) => {
        assert.properties(
          user,
          ['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at', 'updated_at'],
        )

        assert.notProperty(user, 'password')
      })
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USERS_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client, assert }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      for (const userRole of unauthorizedUserRoles) {
        // set the TEST_USER role to false value directly. NOTE: The TEST_USER is admin as default
        const user = await User.updateOrCreate({ id: TEST_ADMIN_ID }, { role: userRole })

        assert.propertyVal(user.$attributes, 'role', userRole)

        const response = await client.get(USERS_PATH).guard('api').loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
