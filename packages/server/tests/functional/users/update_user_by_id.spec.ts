import { test } from '@japa/runner'
import { StatusCodes, UserRole, UserStatus } from 'App/Enums'
import { User } from 'App/Models'
import UserFactory from 'Database/factories/UserFactory'
import {
  TEST_ADMIN_ID, TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'

test.group('PATCH /users/:id', (group) => {
  group.each.setup(setTransaction)

  const payload = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@email.com',
    password: '!Password11',
  }

  test('it should update a user data by id, if the logged user role is admin',
    async ({ client, assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const user = await UserFactory.with('profile').create()

      const updatePath = Route.makeUrl('users.update', { id: user.id })
      const getPath = Route.makeUrl('users.show', { id: user.id })

      const expectedUserProperties = ['id', 'email', 'role', 'status', 'createdAt', 'updatedAt', 'profile', 'name']

      const preUpdateData = await client.get(getPath)
        .guard('api')
        .loginAs(admin)

      const { updatedAt } = preUpdateData.body()

      const response = await client
        .patch(updatePath)
        .json(payload)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.OK)

      assert.notPropertyVal(response.body(), 'updatedAt', updatedAt)
      assert.properties(
        response.body(),
        expectedUserProperties,
      )

      assert.notProperty(response.body(), 'password')

      const getUpdatedUser = await client
        .get(getPath)
        .guard('api')
        .loginAs(admin)

      const data = getUpdatedUser.body()

      assert.propertyVal(data, 'name', `${payload.firstName} ${payload.lastName}`)
      assert.propertyVal(data, 'email', `${payload.email}`)
    })

  test('it should update the user if the logged user id and the targeted id are the same',
    async ({ client, assert }) => {
      const user = await UserFactory.with('profile').create()

      const updatePath = Route.makeUrl('users.update', { id: user.id })
      const getPath = Route.makeUrl('users.show', { id: user.id })

      const expectedUserProperties = ['id', 'email', 'role', 'status', 'createdAt', 'updatedAt', 'profile', 'name']

      const preUpdateData = await client.get(getPath)
        .guard('api')
        .loginAs(user)

      const { updatedAt } = preUpdateData.body()

      const response = await client
        .patch(updatePath)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.notPropertyVal(response.body(), 'updatedAt', updatedAt)
      assert.properties(
        response.body(),
        expectedUserProperties,
      )

      assert.notProperty(response.body(), 'password')

      const getUpdatedUser = await client
        .get(getPath)
        .guard('api')
        .loginAs(user)

      const data = getUpdatedUser.body()

      assert.propertyVal(data, 'name', `${payload.firstName} ${payload.lastName}`)
      assert.propertyVal(data, 'email', `${payload.email}`)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const path = Route.makeUrl('users.update', { id: TEST_USER_ID })

      const response = await client
        .patch(path)
        .json(payload)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const invalidId = 99999

      const path = Route.makeUrl('users.update', { id: invalidId })

      const response = await client.patch(path)
        .json(payload)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })

  test('it should return validation error if some of the given data not valid',
    async ({ client, assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const path = Route.makeUrl('users.update', { id: TEST_USER_ID })

      const requiredUserProperties = ['firstName', 'lastName', 'email', 'password', 'role', 'status']

      // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
      for (const userProperty of requiredUserProperties) {
        const data = {
          ...payload,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
        }

        data[userProperty] = '_'

        const response = await client
          .patch(path)
          .json(data)
          .guard('api')
          .loginAs(admin)

        assert.properties(data, requiredUserProperties)
        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })

  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      const { id: targetedId } = await UserFactory.with('profile').create()
      const targetedUserPath = Route.makeUrl('users.update', { id: targetedId })

      for (const userRole of unauthorizedUserRoles) {
        const user = await User.findByOrFail('role', userRole)

        const response = await client
          .patch(targetedUserPath)
          .json(payload)
          .guard('api')
          .loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
