import { test } from '@japa/runner'
import { PostState, StatusCodes } from 'App/Enums'
import { Post, User } from 'App/Models'
import {
  TEST_ADMIN_ID,
  TEST_AUTHOR_ID,
  TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'

test.group('DELETE /posts/:slug', (group) => {
  group.each.setup(setTransaction)

  test('it should delete the post, if it is not public but the logged user is the author of the post',
    async ({ client }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const { slug } = (await Post
        .query()
        .where('user_id', '=', author.id)
        .andWhere('state', '=', PostState.DRAFT)
        .limit(1))[0]

      const path = Route.makeUrl('posts.destroy', { slug })

      const response = await client
        .delete(path)
        .guard('api')
        .loginAs(author)

      response.assertStatus(StatusCodes.NO_CONTENT)

      // check the deleted post is really deleted from database
      const getPath = Route.makeUrl('posts.show', { slug })
      const responseAfterDelete = await client
        .get(getPath)
        .guard('api')
        .loginAs(author)

      responseAfterDelete.assertStatus(StatusCodes.NOT_FOUND)
    })

  test('it should delete the post, if the logged user role is admin even if the post is public',
    async ({ client }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const { slug } = (await Post
        .query()
        .where('user_id', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1))[0]

      const path = Route.makeUrl('posts.destroy', { slug })

      const response = await client
        .delete(path)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.NO_CONTENT)

      // check the deleted post is really deleted from database
      const getPath = Route.makeUrl('posts.show', { slug })

      const responseAfterDelete = await client
        .delete(getPath)
        .guard('api')
        .loginAs(admin)

      responseAfterDelete.assertStatus(StatusCodes.NOT_FOUND)
    })

  test('it should return an error (403 FORBIDDEN), if the post is public and the logged user is the author of the post',
    async ({ client }) => {
      const author = await User.findOrFail(TEST_AUTHOR_ID)

      const { slug } = (await Post
        .query()
        .where('user_id', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1))[0]

      const path = Route.makeUrl('posts.destroy', { slug })

      const response = await client.delete(path).guard('api').loginAs(author)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })

  test('it should be return an error (403 FORBIDDEN) if the logged user role is  USER',
    async ({ client }) => {
      const user = await User.findOrFail(TEST_USER_ID)

      const { slug } = (await Post
        .query()
        .where('user_id', TEST_AUTHOR_ID)
        .andWhere('state', '=', PostState.PUBLIC)
        .limit(1))[0]

      const path = Route.makeUrl('posts.destroy', { slug })

      const response = await client
        .delete(path)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.FORBIDDEN)
      response.assertTextIncludes('E_AUTHORIZATION_FAILURE')
    })
})
