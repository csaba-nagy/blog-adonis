import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes, UserRole } from 'App/Enums'
import { string } from '@ioc:Adonis/Core/Helpers'
import { User } from 'App/Models'
import UserFactory from 'Database/factories/UserFactory'
import { DB_CONNECTION, TEST_ADMIN_ID, USERS_PATH, USER_PATH_WITH_ID } from '../../constantsForTests'

test.group('GET /users/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return a valid user account by id if the request initiating user is an admin',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const requiredUserProperties = Object
        .getOwnPropertyNames(user.$attributes)
        .filter(prop => prop !== 'password') // 👈 We do not need the password property
        .map(prop => string.snakeCase(prop)) // 👈 Need to convert to snake_case

      // Only the admin users can fire this action
      assert.propertyVal(user.$attributes, 'role', UserRole.ADMIN)

      const response = await client
        .get(USER_PATH_WITH_ID)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.properties(response.body(), requiredUserProperties)

      assert.notProperty(response.body(), 'password')

      assert.propertyVal(response.body(), 'id', TEST_ADMIN_ID)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USER_PATH_WITH_ID)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)
      const invalidId = 99999
      const response = await client
        .get(`${USERS_PATH}/${invalidId}`)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client, assert }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      const { id } = await UserFactory.create()
      const targetedUserPath = `${USERS_PATH}/${id}`

      for (const userRole of unauthorizedUserRoles) {
        // set the TEST_USER role to false value directly. NOTE: The TEST_USER is admin as default
        const user = await User.updateOrCreate({ id: TEST_ADMIN_ID }, { role: userRole })

        assert.propertyVal(user.$attributes, 'role', userRole)

        const response = await client.get(targetedUserPath).guard('api').loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
