import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import {
  TEST_ADMIN_ID,
  TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'
import UserFactory from 'Database/factories/UserFactory'

test.group('GET /profile/:id', (group) => {
  group.each.setup(setTransaction)

  const expectedProperties = [
    'user_id',
    'avatar_url',
    'biography',
    'website_url',
    'facebook_url',
    'twitter_url',
    'instagram_url',
    'youtube_url',
    'github_url',
    'linkedin_url',
    'updated_at',
  ]

  test('it should return a valid user profile, if the logged user is authenticated (admin only)',
    async ({ client, assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const path = Route.makeUrl('profiles.show', { id: TEST_USER_ID })

      const response = await client
        .get(path)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.OK)

      assert.propertyVal(response.body(), 'user_id', TEST_USER_ID)
      assert.properties(response.body(), expectedProperties)
    })

  test('it should return the logged user profile, if the targeted id and the user id are the same',
    async () => {
      async ({ client, assert }) => {
        const user = await UserFactory.create()
        const path = Route.makeUrl('profiles.show', { id: user.id })

        const response = await client
          .get(path)
          .guard('api')
          .loginAs(user)

        response.assertStatus(StatusCodes.OK)

        assert.propertyVal(response.body(), 'user_id', TEST_USER_ID)
        assert.properties(response.body(), expectedProperties)
      }
    })

  test('it should return an error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const path = Route.makeUrl('profiles.show', { id: TEST_USER_ID })

      const response = await client.get(path)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT FOUND), if the given id is invalid',
    async ({ client }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const invalidId = 99999
      const path = Route.makeUrl('profiles.show', { id: invalidId })

      const response = await client
        .get(path)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
})
