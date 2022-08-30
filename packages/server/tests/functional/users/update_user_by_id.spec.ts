import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DB_CONNECTION, TEST_USER_ID, USERS_PATH, USER_PATH_WITH_ID } from '../constantsForTesting'

test.group('PATCH /users/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should update user data if the user is authenticated',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const userProperties = Object.getOwnPropertyNames(user.$attributes)
        .filter(prop => prop !== 'password') // 👈 We do not need the password property
        .map(prop => string.snakeCase(prop)) // 👈 Need to convert to snake_case

      const payload = {
        firstName: 'John',
        lastName: 'Doe',
      }

      const preUpdateData = await client.get(USER_PATH_WITH_ID)
        .guard('api')
        .loginAs(user)

      const { updated_at } = preUpdateData.body()

      const response = await client
        .patch(USER_PATH_WITH_ID)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.notPropertyVal(response.body(), 'updated_at', updated_at)
      assert.properties(
        response.body(),
        userProperties,
      )

      assert.notProperty(response.body(), 'password')

      const getUpdatedUser = await client
        .get(USER_PATH_WITH_ID)
        .guard('api')
        .loginAs(user)

      assert.propertyVal(getUpdatedUser.body(), 'first_name', payload.firstName)
      assert.propertyVal(getUpdatedUser.body(), 'last_name', payload.lastName)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client, assert }) => {
      const payload = {} // 👈 payload data is not relevant in this case

      const response = await client
        .patch(USER_PATH_WITH_ID)
        .json(payload)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      assert.properties(response.body(), ['errors'])
      assert.exists(response.body().errors[0].message)
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)
      const invalidId = 99999

      const payload = {
        firstName: 'James',
      }

      const response = await client.patch(`${USERS_PATH}/${invalidId}`)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })

  test('it should return validation error if some of the given data not valid',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const requiredUserProperties = ['firstName', 'lastName', 'email', 'password']

      // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      for (const userProperty of requiredUserProperties) {
        const payload = {
          firstName: 'James',
          lastName: 'Jones',
          email: 'jamesjones@email.com',
          password: 'verysafepassword',
        }

        payload[userProperty] = '_'

        const response = await client
          .patch(USER_PATH_WITH_ID)
          .json(payload)
          .guard('api')
          .loginAs(user)

        assert.properties(payload, requiredUserProperties)
        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
