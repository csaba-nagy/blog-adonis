import { test } from '@japa/runner'
import { PostCategory, PostState, StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import { TEST_AUTHOR_ID, TEST_USER_ID } from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'

test.group('POST /posts', (group) => {
  group.each.setup(setTransaction)

  const payload = {
    pageTitle: 'test post',
    title: 'test post',
    category: PostCategory.TECH,
    description: 'Et eiusmod ex sunt ullamco fugiat tempor elit.',
    metaDescription: 'Et eiusmod ex sunt ullamco fugiat tempor elit.',
    state: PostState.PUBLIC,
    body: 'Ullamco incididunt sint ad occaecat nisi occaecat commodo elit.',
  }

  test('it should create a new post', async ({ client, assert }) => {
    const author = await User.findByOrFail('id', TEST_AUTHOR_ID)

    const requiredProperties = [
      'id',
      'pageTitle',
      'title',
      'slug',
      'category',
      'userId',
      'description',
      'metaDescription',
      'body',
      'state',
      'createdAt',
      'updatedAt',
    ]

    const path = Route.makeUrl('posts.store')

    const response = await client
      .post(path)
      .guard('api')
      .loginAs(author)
      .json(payload)

    response.assertStatus(StatusCodes.CREATED)

    assert.properties(response.body(), requiredProperties)
  })

  test('it should return an error (401 - UNAUTHORIZED) if the user is not logged in',
    async ({ client }) => {
      const path = Route.makeUrl('posts.store')

      const response = await client.post(path).json(payload)

      response.assertStatus(StatusCodes.UNAUTHORIZED)
      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return an error (403 - FORBIDDEN) if the user is not allowed to create post',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const path = Route.makeUrl('posts.store')

      const response = await client.post(path).loginAs(user).json(payload)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should return validation error if some of the given data not valid',
    async ({ client, assert }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const path = Route.makeUrl('posts.store')

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
          .post(path)
          .json(data)
          .guard('api')
          .loginAs(author)

        assert.properties(payload, requiredProperties)
        response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)

        assert.properties(response.body(), ['errors'])
        assert.exists(response.body().errors[0].message)
      }
    })
})
