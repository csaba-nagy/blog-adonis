import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { TEST_ADMIN_ID, USER_ACCOUNT_PATH } from 'Shared/const'
import { setTransaction } from 'Tests/helpers'

test.group('GET /account', (group) => {
  group.each.setup(setTransaction)

  test('it should return the authenticated user account',
    async ({ client, assert }) => {
      const userToAuth = await User.findOrFail(TEST_ADMIN_ID)

      const expectedUserProperties = ['created_at', 'email', 'id', 'name', 'profile', 'role', 'status', 'updated_at']

      const response = await client
        .get(USER_ACCOUNT_PATH)
        .guard('api')
        .loginAs(userToAuth)

      response.assertStatus(StatusCodes.OK)
      assert.properties(response.body(), expectedUserProperties)
      assert.notProperty(response.body(), 'password')
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USER_ACCOUNT_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })
})
