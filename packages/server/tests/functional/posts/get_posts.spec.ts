import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { PostState, StatusCodes, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import {
  DB_CONNECTION,
  POSTS_PATH_PREFIX,
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'

test.group('GET /posts', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return public posts only if the user is not logged in',
    async ({ client, assert }) => {
      const response = await client.get(POSTS_PATH_PREFIX)

      response.body().forEach((post) => {
        assert.strictEqual(post.state, PostState.PUBLIC)
      })
    })

  test('it should return public posts only if the logged user role is "USER"',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const response = await client.get(POSTS_PATH_PREFIX).guard('api').loginAs(user)

      assert.strictEqual(user.role, UserRole.USER)
      response.body().forEach((post) => {
        assert.strictEqual(post.state, PostState.PUBLIC)
      })
    })

  test('it should return all posts of the logged author', async ({ client, assert }) => {
    const author = await User.findOrFail(TEST_AUTHOR_ID)

    const { name: authorName } = author.serialize()

    const response = await client.get(POSTS_PATH_PREFIX).guard('api').loginAs(author)

    response.assertStatus(StatusCodes.OK)

    response.body().forEach(post => assert.equal(post.author.name, authorName))
  })
})
