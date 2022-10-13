import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { PostState, StatusCodes } from 'App/Enums'
import { Post, User } from 'App/Models'
import {
  DB_CONNECTION,
  POSTS_PATH_PREFIX,
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'

test.group('PATCH /posts/:slug/publish', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should publish the post if the author of the post is logged in',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const posts = await Post
        .query()
        .where('author_id', '=', author.id)
        .andWhere('state', '=', PostState.DRAFT)
        .limit(1)

      const { slug, publishedAt } = posts[0]

      const response = await client
        .patch(`${POSTS_PATH_PREFIX}/${slug}/publish`)
        .guard('api')
        .loginAs(author)
      response.assertStatus(StatusCodes.OK)
      assert.strictEqual(response.body().state, PostState.PUBLIC)
      assert.notEqual(response.body().published_at, publishedAt)
    })

  test('it should return an error (403 FORBIDDEN) if the post is already published',
    async ({ client }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const posts = await Post
        .query()
        .where('author_id', '=', author.id)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1)

      const { slug } = posts[0]

      const response = await client
        .patch(`${POSTS_PATH_PREFIX}/${slug}/publish`)
        .guard('api')
        .loginAs(author)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return an error (403 FORBIDDEN) if the logged user is not authorized',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const posts = await Post
        .query()
        .where('author_id', '=', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.DRAFT)
        .limit(1)

      const { slug } = posts[0]

      const response = await client
        .patch(`${POSTS_PATH_PREFIX}/${slug}/publish`)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return an error (401 UNAUTHORIZED) if the user is not logged in',
    async ({ client }) => {
      const posts = await Post
        .query()
        .where('author_id', '=', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.DRAFT)
        .limit(1)

      const { slug } = posts[0]

      const response = await client.patch(`${POSTS_PATH_PREFIX}/${slug}/publish`)

      response.assertStatus(StatusCodes.UNAUTHORIZED)
      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })
})
