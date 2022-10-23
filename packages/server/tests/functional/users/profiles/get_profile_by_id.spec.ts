import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import {
  TEST_ADMIN_ID,
  TEST_USER_ID,
  USER_PROFILE_PATH,
  USER_PROFILE_PATH_WITH_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'

test.group('GET /profile/:id', (group) => {
  group.each.setup(setTransaction)

  test('it should return a valid user profile if the user is authenticated',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)

      const expectedUserProfileProperties = [
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

      const response = await client
        .get(USER_PROFILE_PATH_WITH_USER_ID)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.propertyVal(response.body(), 'user_id', TEST_USER_ID)
      assert.properties(response.body(), expectedUserProfileProperties)
    })

  test('it should return an error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USER_PROFILE_PATH_WITH_USER_ID)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT FOUND), if the given id is invalid',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_ADMIN_ID)
      const invalidId = 99999
      const response = await client
        .get(`${USER_PROFILE_PATH}/${invalidId}`)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
})
