import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes, UserRole, UserStatus } from 'App/Enums'
import { User } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import UserFactory from 'Database/factories/UserFactory'
import { DB_CONNECTION, TEST_ADMIN_ID, USERS_PATH, USER_PATH_WITH_ID } from '../../constantsForTests'

test.group('PATCH /users/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should update a user data by if the request initiating user is an admin',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID) // 👈 TEST_USER is admin by default

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

      // Only the admin users can fire this action
      assert.propertyVal(user.$attributes, 'role', UserRole.ADMIN)

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
    async ({ client }) => {
      const payload = {} // 👈 payload data is not relevant in this case

      const response = await client
        .patch(USER_PATH_WITH_ID)
        .json(payload)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)
      const invalidId = 99999

      const payload = {
        firstName: 'James',
      }

      // Only the admin users can fire this action
      assert.propertyVal(user.$attributes, 'role', UserRole.ADMIN)

      const response = await client.patch(`${USERS_PATH}/${invalidId}`)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })

  test('it should return validation error if some of the given data not valid',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const requiredUserProperties = ['firstName', 'lastName', 'email', 'role', 'status']

      // Only the admin users can fire this action
      assert.propertyVal(user.$attributes, 'role', UserRole.ADMIN)

      // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      for (const userProperty of requiredUserProperties) {
        const payload = {
          firstName: 'James',
          lastName: 'Jones',
          email: 'jamesjones@email.com',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
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
  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client, assert }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      const { id } = await UserFactory.create()
      const targetedUserPath = `${USERS_PATH}/${id}`

      for (const userRole of unauthorizedUserRoles) {
        // set the TEST_USER role to false value directly. NOTE: The TEST_USER is admin as default
        const user = await User.updateOrCreate({ id: TEST_ADMIN_ID }, { role: userRole })

        assert.propertyVal(user.$attributes, 'role', userRole)

        const response = await client
          .patch(targetedUserPath)
          .json({}) // payload is not relevant in this case
          .guard('api')
          .loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
