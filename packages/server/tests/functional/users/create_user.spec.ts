import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import {
  TEST_ADMIN_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import UserFactory from 'Database/factories/UserFactory'
import Route from '@ioc:Adonis/Core/Route'

test.group('POST /users', (group) => {
  group.each.setup(setTransaction)

  const validPassword = '!Password1234'

  test('it should create a new user', async ({ client, assert }) => {
    const { firstName, lastName, email, password } = await UserFactory.make()

    const path = Route.makeUrl('users.store')

    const requiredProperties = ['id', 'name', 'profile', 'account']

    const response = await client.post(path).json({ firstName, lastName, email, password })

    const data = response.body()

    response.assertStatus(StatusCodes.CREATED)

    assert.properties(data, requiredProperties)

    assert.notProperty(data, 'password')

    // TODO: 'refactor the test below when the profiles routes are also refactored'

    // const profilePath = Route.makeUrl('')

    // const responseToGetCreatedProfile = await client
    //   .get(profilePath)
    //   .guard('api')
    //   .loginAs(await User.findOrFail(TEST_ADMIN_ID))

    // responseToGetCreatedProfile.assertStatus(StatusCodes.OK)
  })

  test('it should return error (422 UNPROCESSABLE_ENTITY) if the given email is already registered in the database',
    async ({ client, assert }) => {
      const { email: emailInUse } = await User.findOrFail(TEST_ADMIN_ID)

      const path = Route.makeUrl('users.store')

      const payload = {
        firstName: 'test',
        lastName: 'test',
        email: emailInUse,
        password: validPassword,
      }

      const response = await client.post(path).json(payload)

      response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

      assert.properties(response.body(), ['errors'])

      assert.equal(response.body().errors[0].message, 'Invalid email address')
    })

  test('it should return error (422 UNPROCESSABLE_ENTITY) if some of the required user data is missing',
    async ({ client, assert }) => {
      const requiredUserData = ['firstName', 'lastName', 'email', 'password']

      const path = Route.makeUrl('users.store')

      // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      for (const userData of requiredUserData) {
        const payload = {
          firstName: 'test',
          lastName: 'test',
          email: 'test@email.com',
          password: validPassword,
        }

        payload[userData] = ''

        const response = await client.post(path).json(payload)

        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
