import { test } from '@japa/runner'
import { PostState, UserRole } from 'App/Enums'
import { User } from 'App/Models'
import {
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'
import { getAllPost, setTransaction } from 'Tests/helpers'

test.group('GET /posts', (group) => {
  group.each.setup(setTransaction)

  test('it should return public posts only if the user is not logged in',
    async ({ client, assert }) => {
      const posts = await getAllPost(client)

      posts.forEach(post => assert.strictEqual(post.state, PostState.PUBLIC))
    })

  test('it should return public posts only if the logged user role is USER',
    async ({ client, assert }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const posts = await getAllPost(client, user)

      assert.strictEqual(user.role, UserRole.USER)

      posts.forEach(post => assert.strictEqual(post.state, PostState.PUBLIC))
    })

  test('it should return all posts of the logged author', async ({ client, assert }) => {
    const author = await User.findOrFail(TEST_AUTHOR_ID)

    const posts = await getAllPost(client, author)

    const { name: authorName } = author.serialize()

    posts.forEach(post => assert.equal(post.author.name, authorName))
  })
})
