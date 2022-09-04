import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_ADMIN_ID, USERS_PATH, USER_PROFILE_PATH } from '../../constantsForTests'

test.group('POST /users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should create a new user', async ({ client, assert }) => {
    const payload = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@email.com',
      password: 'testpassword',
    }

    const requiredProperties = ['id', 'first_name', 'last_name', 'email', 'created_at', 'updated_at']

    const response = await client.post(USERS_PATH).json(payload)
    const { id } = response.body()

    response.assertStatus(StatusCodes.CREATED)

    assert.properties(response.body(), requiredProperties)

    assert.notProperty(response.body(), 'password')

    const responseToGetCreatedProfile = await client
      .get(`${USER_PROFILE_PATH}/${id}`)
      .guard('api')
      .loginAs(await User.findOrFail(TEST_ADMIN_ID))

    responseToGetCreatedProfile.assertStatus(StatusCodes.OK)

    assert.propertyVal(responseToGetCreatedProfile.body(), 'user_id', id)
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

      const response = await client.post(USERS_PATH).json(payload)

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
          password: 'password',
        }

        payload[userData] = ''

        const response = await client.post(USERS_PATH).json(payload)

        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
