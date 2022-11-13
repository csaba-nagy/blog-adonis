import { test } from '@japa/runner'
import { PostCategory, PostState, StatusCodes } from 'App/Enums'
import { Post, User } from 'App/Models'
import {
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'

test.group('PATCH /posts', (group) => {
  group.each.setup(setTransaction)

  const payload = {
    pageTitle: 'updated post',
    title: 'updated post',
    category: PostCategory.TECH,
    description: 'This is an updated description.',
    metaDescription: 'This is an updated description.',
    state: PostState.PUBLIC,
    body: 'The content has been updated',
  }

  test('it should update a not published post by an authorized user (author)',
    async ({ client, assert }) => {
      const author = await User.findByOrFail('id', TEST_AUTHOR_ID)

      const { state, updatedAt, slug } = await Post.findByOrFail('user_id', author.id)

      const path = Route.makeUrl('posts.update', { slug })

      const response = await client
        .patch(path)
        .json(payload)
        .guard('api')
        .loginAs(author)

      assert.notEqual(state, PostState.PUBLIC)

      response.assertStatus(StatusCodes.OK)

      assert.notPropertyVal(response.body(), 'updatedAt', updatedAt)
    })

  test('it should return an error (401 UNAUTHORIZED), if the user is not authenticated',
    async ({ client, assert }) => {
      const { state, slug } = await Post.findByOrFail('user_id', TEST_AUTHOR_ID)

      const path = Route.makeUrl('posts.update', { slug })

      const response = await client.patch(path).json(payload)

      assert.notEqual(state, PostState.PUBLIC)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return an error (403 FORBIDDEN), if the state of the post is already public and the logged user is the author',
    async ({ client }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const { slug } = (await Post
        .query()
        .where('user_id', '=', author.id)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1))[0]

      const path = Route.makeUrl('posts.update', { slug })

      const response = await client
        .patch(path)
        .json(payload)
        .guard('api')
        .loginAs(author)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return an error (403 FORBIDDEN) if the logged USER tries to update a post',
    async ({ client }) => {
      const { slug } = await Post.findByOrFail('userId', TEST_AUTHOR_ID)

      const user = await User.findOrFail(TEST_USER_ID)

      const path = Route.makeUrl('posts.update', { slug })

      const response = await client
        .patch(path)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return validation error, if some of the given data not valid',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const { slug } = await Post.findByOrFail('user_id', author.id)

      const path = Route.makeUrl('posts.update', { slug })

      const requiredProperties = [
        'pageTitle',
        'title',
        'category',
        'description',
        'metaDescription',
        'body',
        'state',
      ]

      for (const property of requiredProperties) {
        const data = {
          ...payload,
        }

        data[property] = '_'

        const response = await client
          .patch(path)
          .json(data)
          .guard('api')
          .loginAs(author)

        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
