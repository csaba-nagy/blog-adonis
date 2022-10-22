import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { PostCategory, PostState, StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { DB_CONNECTION, POSTS_PATH_PREFIX, TEST_AUTHOR_ID, TEST_USER_ID } from 'Shared/const'

test.group('POST /posts', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should create a new post', async ({ client, assert }) => {
    const author = await User.findByOrFail('id', TEST_AUTHOR_ID)

    const payload = {
      pageTitle: 'test post',
      title: 'test post',
      category: PostCategory.TECH,
      authorId: author.id,
      description: 'Et eiusmod ex sunt ullamco fugiat tempor elit.',
      metaDescription: 'Et eiusmod ex sunt ullamco fugiat tempor elit.',
      state: PostState.PUBLIC,
      body: 'Ullamco incididunt sint ad occaecat nisi occaecat commodo elit.',
    }

    const requiredProperties = [
      'id',
      'page_title',
      'title',
      'slug',
      'category',
      'user_id',
      'description',
      'meta_description',
      'body',
      'state',
      'created_at',
      'updated_at',
    ]

    const response = await client
      .post(POSTS_PATH_PREFIX)
      .guard('api')
      .loginAs(author)
      .json(payload)

    response.assertStatus(StatusCodes.CREATED)

    assert.properties(response.body(), requiredProperties)
  })

  test('it should return an error (401 - UNAUTHORIZED) if the user is not logged in',
    async ({ client }) => {
      const response = await client.post(POSTS_PATH_PREFIX).json({})

      response.assertStatus(StatusCodes.UNAUTHORIZED)
      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return an error (403 - FORBIDDEN) if the user is not allowed to create post',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)
      const response = await client.post(POSTS_PATH_PREFIX).loginAs(user).json({})

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return validation error if some of the given data not valid',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

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
          .post(POSTS_PATH_PREFIX)
          .json(payload)
          .guard('api')
          .loginAs(author)

        assert.properties(payload, requiredProperties)
        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
