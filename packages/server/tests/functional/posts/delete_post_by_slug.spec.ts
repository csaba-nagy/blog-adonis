import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { PostState, StatusCodes } from 'App/Enums'
import { Post, User } from 'App/Models'
import {
  DB_CONNECTION,
  POSTS_PATH_PREFIX,
  TEST_ADMIN_ID,
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'

test.group('DELETE /posts/:slug', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should delete the post if it is not public and the logged user is the author of the post',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)
      const { slug, state } = await Post.findByOrFail('author_id', author.id)

      assert.strictEqual(state, PostState.DRAFT)

      const response = await client
        .delete(`${POSTS_PATH_PREFIX}/${slug}`)
        .guard('api')
        .loginAs(author)

      response.assertStatus(StatusCodes.OK)

      const responseAfterDelete = await client
        .delete(`${POSTS_PATH_PREFIX}/${slug}`)
        .guard('api')
        .loginAs(author)

      responseAfterDelete.assertStatus(StatusCodes.NOT_FOUND)
    })

  test('it should delete the post if the logged user is admin even if the post is public',
    async ({ client }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const posts = await Post
        .query()
        .where('author_id', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1)

      const { slug } = posts[0]

      const response = await client.delete(`${POSTS_PATH_PREFIX}/${slug}`).guard('api').loginAs(admin)

      response.assertStatus(StatusCodes.OK)

      const responseAfterDelete = await client
        .delete(`${POSTS_PATH_PREFIX}/${slug}`)
        .guard('api')
        .loginAs(admin)

      responseAfterDelete.assertStatus(StatusCodes.NOT_FOUND)
    })

  test('it should return an error (403 FORBIDDEN) if the post is public and the logged user is the author of the post',
    async ({ client }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const posts = await Post
        .query()
        .where('author_id', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1)

      const { slug } = posts[0]

      const response = await client.delete(`${POSTS_PATH_PREFIX}/${slug}`).guard('api').loginAs(author)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should be return an error (403 FORBIDDEN) if the logged user role is "USER"',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const posts = await Post
        .query()
        .where('author_id', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1)

      const { slug } = posts[0]

      const response = await client.delete(`${POSTS_PATH_PREFIX}/${slug}`).guard('api').loginAs(user)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })
})
