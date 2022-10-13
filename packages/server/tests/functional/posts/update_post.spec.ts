import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { PostCategory, PostState, StatusCodes } from 'App/Enums'
import { Post, User } from 'App/Models'
import {
  DB_CONNECTION,
  POSTS_PATH_PREFIX,
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'

test.group('PATCH /posts', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should update a not published post as the author',
    async ({ client, assert }) => {
      const author = await User.findByOrFail('id', TEST_AUTHOR_ID)

      const payload = {
        body: 'updated test body text',
      }

      const { state, updatedAt, slug } = await Post.findByOrFail('author_id', author.id)

      const response = await client
        .patch(`${POSTS_PATH_PREFIX}/${slug}`)
        .json(payload)
        .guard('api')
        .loginAs(author)

      assert.notEqual(state, PostState.PUBLIC)

      response.assertStatus(StatusCodes.OK)

      assert.notPropertyVal(response.body(), 'updated_at', updatedAt)

      assert.propertyVal(response.body(), 'body', payload.body)
    })

  test('it should return an error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client, assert }) => {
      const { state, slug } = await Post.findByOrFail('author_id', TEST_AUTHOR_ID)

      const response = await client.patch(`${POSTS_PATH_PREFIX}/${slug}`).json({})

      assert.notEqual(state, PostState.PUBLIC)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return an error (403 FORBIDDEN) if the state of the post is already public',
    async ({ client }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)
      const posts = await Post
        .query()
        .where('author_id', '=', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1)

      const { slug } = posts[0]

      const response = await client
        .patch(`${POSTS_PATH_PREFIX}/${slug}`)
        .json({})
        .guard('api')
        .loginAs(author)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return an error (403 FORBIDDEN) if the logged USER tries to update a post',
    async ({ client }) => {
      const { slug } = await Post.findByOrFail('author_id', TEST_AUTHOR_ID)

      const user = await User.findOrFail(TEST_USER_ID)

      const response = await client
        .patch(`${POSTS_PATH_PREFIX}/${slug}`)
        .json({})
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return validation error if some of the given data not valid',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)
      const { slug } = await Post.findByOrFail('author_id', author.id)

      const optionalProperties = [
        'pageTitle',
        'title',
        'category',
        'description',
        'metaDescription',
        'body',
        'state',
      ]

      for (const property of optionalProperties) {
        const payload = {
          pageTitle: 'test page title',
          title: 'test title',
          category: PostCategory.AFK,
          description: 'test description',
          metaDescription: 'test meta description',
          body: 'test body text',
          state: PostState.DRAFT,
        }

        payload[property] = '_'

        const response = await client
          .patch(`${POSTS_PATH_PREFIX}/${slug}`)
          .json(payload)
          .guard('api')
          .loginAs(author)

        assert.properties(payload, optionalProperties)
        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
