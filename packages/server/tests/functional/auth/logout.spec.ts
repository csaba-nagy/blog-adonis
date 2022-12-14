import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { AUTH_LOGOUT_PATH, TEST_ADMIN_ID } from 'Shared/const'
import { setTransaction } from 'Tests/helpers'

test.group('GET /auth/logout', (group) => {
  group.each.setup(setTransaction)

  test('it should logout the authenticated user', async ({ client }) => {
    const user = await User.find(TEST_ADMIN_ID)
    const response = await client.get(AUTH_LOGOUT_PATH).loginAs(user!)

    response.assertStatus(StatusCodes.OK)
    response.assertBody({ revoked: true })
    response.assertCookie('token', null)
  })

  test('it should return error (401 UNAUTHORIZED) when try to reach the logout path as a guest',
    async ({ client }) => {
      const responseWithoutAuthenticatedUser = await client.get(AUTH_LOGOUT_PATH)

      responseWithoutAuthenticatedUser.assertStatus(StatusCodes.UNAUTHORIZED)
    })
})
