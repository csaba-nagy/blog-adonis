import { test } from '@japa/runner'
import { PostState, StatusCodes } from 'App/Enums'
import { Post, User } from 'App/Models'
import {
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'

test.group('GET /posts/:slug', (group) => {
  group.each.setup(setTransaction)

  test('it should return a blog post, if the post state is public and the user is not logged in',
    async ({ client, assert }) => {
      const { slug } = await Post.findByOrFail('state', PostState.PUBLIC)

      const path = Route.makeUrl('posts.show', { slug })

      const response = await client.get(path)

      response.assertStatus(StatusCodes.OK)
      assert.strictEqual(slug, response.body().slug)
    })

  test('it should return the blog post to the author of the post even the state is not public',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const { slug } = (await Post.query()
        .where('user_id', '=', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.DRAFT)
        .limit(1))[0]

      const path = Route.makeUrl('posts.show', { slug })

      const response = await client.get(path).guard('api').loginAs(author)

      response.assertStatus(StatusCodes.OK)
      assert.strictEqual(slug, response.body().slug)
    })

  test('it should return an error (403 FORBIDDEN), if the blog post is not visible and the user is not logged in',
    async ({ client }) => {
      const { slug } = await Post.findByOrFail('state', PostState.DRAFT)

      const path = Route.makeUrl('posts.show', { slug })

      const response = await client.get(path)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return an error (403 FORBIDDEN), if the user is logged in (not the author of the post), but the post is not visible',
    async ({ client }) => {
      const { slug } = await Post.findByOrFail('state', PostState.DRAFT)

      const user = await User.findOrFail(TEST_USER_ID)

      const path = Route.makeUrl('posts.show', { slug })

      const response = await client.get(path).guard('api').loginAs(user)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })
})
