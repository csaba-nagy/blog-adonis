import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import UserFactory from 'Database/factories/UserFactory'
import { AUTH_LOGIN_PATH, DB_CONNECTION } from '../../constantsForTests'

test.group('POST /auth/login', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should login with valid user credentials',
    async ({ client, assert }) => {
      const user = await UserFactory.create()

      const response = await client.post(AUTH_LOGIN_PATH).json({
        email: user.email,
        password: 'verysafepassword', // 👈 that is defined in the UserFactory as default password
        // It's not the best solution, but because of the user object returns with the hashed password
        // the user.password doesn't work
        // TODO: Find a better solution
      })

      response.assertStatus(StatusCodes.OK)

      assert.properties(response.body(), ['type', 'token', 'expires_at'])

      const { type, token } = response.cookie('token')!.value

      assert.strictEqual(type, 'bearer')

      assert.isNotNull(token)
    })

  test('it should return an error (422 UNPROCESSABLE_ENTITY) when try to login with missing authentication data',
    async ({ client, assert }) => {
      const requiredUserData = ['email', 'password']

      // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      for (const userData of requiredUserData) {
        const payload = {
          email: 'test@email.com',
          password: 'password',
        }

        payload[userData] = ''
        const response = await client.post(AUTH_LOGIN_PATH).json(payload)

        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })

  test('it should return error (401 UNAUTHORIZED) when try to login with invalid email',
    async ({ client }) => {
      const payload = {
        email: 'invaliduser@invalidemail.com',
        password: 'password',
      }

      const response = await client
        .post(AUTH_LOGIN_PATH)
        .json(payload)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('Invalid credentials')
    })

  test('it should return error (401 UNAUTHORIZED) when try to login with valid email and invalid password',
    async ({ client, assert }) => {
      const user = await UserFactory.create()

      assert.isNotNull(user)

      const response = await client.post(AUTH_LOGIN_PATH).json({
        email: user.email,
        password: 'invalidpassword',
      })

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('Invalid credentials')
    })
})
