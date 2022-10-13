import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_ADMIN_ID, USER_ACCOUNT_PATH } from 'Shared/const'

test.group('PATCH /account', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should update the authenticated user account',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const payload = {
        email: 'test@email.com',
      }

      const preUpdateData = await client.get(USER_ACCOUNT_PATH)
        .guard('api')
        .loginAs(user)

      const { updated_at } = preUpdateData.body()

      const response = await client
        .patch(USER_ACCOUNT_PATH)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.notPropertyVal(response.body(), 'updated_at', updated_at)

      assert.properties(
        response.body(),
        ['id', 'first_name', 'last_name', 'email', 'created_at', 'updated_at'],
      )

      assert.notProperty(response.body(), 'password')

      const getUpdatedUser = await client
        .get(USER_ACCOUNT_PATH)
        .guard('api')
        .loginAs(user)

      assert.propertyVal(getUpdatedUser.body(), 'email', payload.email)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const payload = {} // 👈 payload data is not relevant in this case

      const response = await client
        .patch(USER_ACCOUNT_PATH)
        .json(payload)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return validation error if some of the given data not valid',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

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
          .patch(USER_ACCOUNT_PATH)
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
