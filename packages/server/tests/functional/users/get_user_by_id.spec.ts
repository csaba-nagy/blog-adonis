import { test } from '@japa/runner'
import { StatusCodes, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import UserFactory from 'Database/factories/UserFactory'
import {
  TEST_ADMIN_ID,
  TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'

test.group('GET /users/:id', (group) => {
  group.each.setup(setTransaction)

  test('it should return a valid user account by id, if the logged user role is admin',
    async ({ client, assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const path = Route.makeUrl('users.show', { id: TEST_USER_ID })

      const expectedUserProperties = [
        'id',
        'email',
        'role',
        'status',
        'created_at',
        'updated_at',
        'profile',
        'name',
      ]

      const response = await client
        .get(path)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.OK)

      assert.properties(response.body(), expectedUserProperties)

      assert.notProperty(response.body(), 'password')

      assert.propertyVal(response.body(), 'id', TEST_USER_ID)
    })

  test('it should return the logged user own data, if the targeted id and the logged user id are the same',
    async ({ client, assert }) => {
      const user = await UserFactory.create()
      const path = Route.makeUrl('users.show', { id: user.id })

      const expectedUserProperties = [
        'id',
        'email',
        'role',
        'status',
        'created_at',
        'updated_at',
        'profile',
        'name',
      ]

      const response = await client
        .get(path)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.properties(response.body(), expectedUserProperties)

      assert.notProperty(response.body(), 'password')

      assert.propertyVal(response.body(), 'id', user.id)
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const path = Route.makeUrl('users.show', { id: TEST_USER_ID })
      const response = await client.get(path)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT_FOUND) if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const invalidId = 99999
      const path = Route.makeUrl('users.show', { id: invalidId })

      const response = await client
        .get(path)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
  test('it should return error (403 FORBIDDEN) if the authenticated user is not authorized',
    async ({ client }) => {
      const unauthorizedUserRoles = [UserRole.AUTHOR, UserRole.USER]

      const { id: userId } = await UserFactory.create()
      const path = Route.makeUrl('users.show', { id: userId })

      for (const userRole of unauthorizedUserRoles) {
        const user = await User.findByOrFail('role', userRole)

        const response = await client.get(path).guard('api').loginAs(user)

        response.assertStatus(StatusCodes.FORBIDDEN)

        response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
      }
    })
})
