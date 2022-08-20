import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { AUTH_LOGIN_PATH, DB_CONNECTION, USERS_PATH } from '../users/constantsForTesting'

test.group('Log in', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })
  test('POST /login', async ({ client, assert }) => {
    const testUserCredentials = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'password',
    }

    const createUser = await client.post(USERS_PATH).json(testUserCredentials)

    createUser.assertStatus(StatusCodes.CREATED)

    const responseToLogin = await client.post(AUTH_LOGIN_PATH).json({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    })
    const responseBody = responseToLogin.body()

    responseToLogin.assertStatus(StatusCodes.OK)
    assert.properties(responseBody, ['type', 'token', 'expires_at'])

    const { type, token } = responseBody

    assert.strictEqual(type, 'bearer')
    assert.isAtLeast(token.length, 10)
    // TODO: Create a test for expires_at
  })
})
