import Database from '@ioc:Adonis/Lucid/Database'
import type { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'
import { PostState, UserRole } from 'App/Enums'
import type { Post } from 'App/Models'
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

  const getAllPost = async (
    client: ApiClient,
    loggedUser: User | null = null,
    nextPageUrl = '/?page=1',
    posts: Post[] = []) => {
    const response = !loggedUser
      ? await client.get(`${POSTS_PATH_PREFIX}${nextPageUrl}`)
      : await client.get(`${POSTS_PATH_PREFIX}${nextPageUrl}`).loginAs(loggedUser)

    const { meta, data } = response.body()
    const { next_page_url } = meta

    posts = [...posts, ...data]

    return !next_page_url ? posts : getAllPost(client, loggedUser, next_page_url, posts)
  }

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
