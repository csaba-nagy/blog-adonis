import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { PostState, StatusCodes } from 'App/Enums'
import { Post, User } from 'App/Models'
import { DB_CONNECTION, POSTS_PATH_PREFIX, TEST_AUTHOR_ID, TEST_USER_ID } from '../../constantsForTests'

test.group('GET /posts/:slug', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return a blog post if the post is visible and the user is not logged in',
    async ({ client, assert }) => {
      const { slug } = await Post.findByOrFail('state', PostState.PUBLIC)

      const response = await client.get(`${POSTS_PATH_PREFIX}/${slug}`)
      const { slug: slugFromResponse } = response.body()

      response.assertStatus(StatusCodes.OK)
      assert.strictEqual(slugFromResponse, slug)
    })

  test('it should return a blog post if the post is visible and the role of the logged user is "USER"',
    async ({ client, assert }) => {
      const { slug } = await Post.findByOrFail('state', PostState.PUBLIC)
      const user = await User.findOrFail(TEST_USER_ID)

      const response = await client.get(`${POSTS_PATH_PREFIX}/${slug}`).guard('api').loginAs(user)

      const { slug: slugFromResponse } = response.body()

      response.assertStatus(StatusCodes.OK)
      assert.strictEqual(slugFromResponse, slug)
    })

  test('it should return the blog post to the author of the post even the state is not public',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)
      const post = await Post.query()
        .where('author_id', '=', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.DRAFT)
        .limit(1)

      const { slug } = post[0]

      const response = await client.get(`${POSTS_PATH_PREFIX}/${slug}`).guard('api').loginAs(author)

      response.assertStatus(StatusCodes.OK)
      assert.strictEqual(slug, response.body().slug)
    })

  test('it should return an error (403 FORBIDDEN) if the blog post is not visible and the user is not logged in',
    async ({ client }) => {
      const { slug } = await Post.findByOrFail('author_id', TEST_AUTHOR_ID)

      const response = await client.get(`${POSTS_PATH_PREFIX}/${slug}`)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return an error (403 FORBIDDEN) if the user is logged in but the post is not visible',
    async ({ client }) => {
      const { slug } = await Post.findByOrFail('author_id', TEST_AUTHOR_ID)
      const user = await User.findOrFail(TEST_USER_ID)

      const response = await client.get(`${POSTS_PATH_PREFIX}/${slug}`).guard('api').loginAs(user)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })
})
