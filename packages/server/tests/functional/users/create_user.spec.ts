import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import {
  TEST_ADMIN_ID,
  USERS_PATH_PREFIX,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import UserFactory from 'Database/factories/UserFactory'

test.group('POST /users', (group) => {
  group.each.setup(setTransaction)

  test('it should create a new user', async ({ client, assert }) => {
    const { firstName, lastName, email, password } = await UserFactory.make()

    const requiredProperties = ['name', 'profile', 'account']

    const response = await client.post(USERS_PATH_PREFIX).json({ firstName, lastName, email, password })

    response.assertStatus(StatusCodes.CREATED)

    assert.properties(response.body(), requiredProperties)

    assert.notProperty(response.body(), 'password')

    const responseToGetCreatedProfile = await client
      .get(response.body().profile)
      .guard('api')
      .loginAs(await User.findOrFail(TEST_ADMIN_ID))

    responseToGetCreatedProfile.assertStatus(StatusCodes.OK)
  })

  test('it should return error (422 UNPROCESSABLE_ENTITY) if the given email is already registered in the database',
    async ({ client, assert }) => {
      const { email: emailInUse } = await User.findOrFail(TEST_ADMIN_ID)

      const payload = {
        firstName: 'test',
        lastName: 'test',
        email: emailInUse,
        password: 'password',
      }

      const response = await client.post(USERS_PATH_PREFIX).json(payload)

      response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

      assert.properties(response.body(), ['errors'])

      assert.equal(response.body().errors[0].message, 'Invalid email address')
    })

  test('it should return error (422 UNPROCESSABLE_ENTITY) if some of the required user data is missing',
    async ({ client, assert }) => {
      const requiredUserData = ['firstName', 'lastName', 'email', 'password']

      // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      for (const userData of requiredUserData) {
        const payload = {
          firstName: 'test',
          lastName: 'test',
          email: 'test@email.com',
          password: '!Password11',
        }

        payload[userData] = ''

        const response = await client.post(USERS_PATH_PREFIX).json(payload)

        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
