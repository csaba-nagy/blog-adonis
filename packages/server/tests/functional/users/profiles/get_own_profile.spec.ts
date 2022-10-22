import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, TEST_USER_ID, USER_PROFILE_PATH } from 'Shared/const'

test.group('GET /profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return the authenticated user profile',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)

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
        .get(USER_PROFILE_PATH)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      assert.propertyVal(response.body(), 'user_id', TEST_USER_ID)
      assert.properties(response.body(), expectedUserProfileProperties)
    })

  test('it should return an error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const response = await client.get(USER_PROFILE_PATH)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })
})
