import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { AUTH_LOGIN_PATH, DB_CONNECTION, TEST_ADMIN_ID, USER_ACCOUNT_PATH } from '../../constantsForTests'

test.group('DELETE /account', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should delete the authenticated user account and profile',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const response = await client
        .delete(USER_ACCOUNT_PATH)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      const responseToLogin = await client.post(AUTH_LOGIN_PATH).json({
        email: user.email,
        password: 'password', // 👈 that is defined in the user seeder as password
        // It's not the best solution, but because of the user object returns with the hashed password
        // the user.password doesn't work
        // TODO: Find a better solution
      })

      responseToLogin.assertStatus(StatusCodes.UNAUTHORIZED)
      responseToLogin.assertTextIncludes('E_AUTHENTICATION_FAILURE')
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.delete(USER_ACCOUNT_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })
})
