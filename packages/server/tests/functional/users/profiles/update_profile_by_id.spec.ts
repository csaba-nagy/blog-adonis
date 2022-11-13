import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { User } from 'App/Models'
import {
  TEST_ADMIN_ID, TEST_USER_ID,
} from 'Shared/const'
import { setTransaction } from 'Tests/helpers'
import Route from '@ioc:Adonis/Core/Route'
import UserFactory from 'Database/factories/UserFactory'

test.group('PATCH /profile/:id', (group) => {
  group.each.setup(setTransaction)

  const payload = {
    avatarUrl: null,
    biography: 'lorem ipsum dolor sit amet',
    websiteUrl: 'https://website.com/',
    facebookUrl: 'https://facebook.com/1',
    twitterUrl: 'https://twitter.com/1',
    instagramUrl: 'https://instagram.com/1',
    youtubeUrl: 'https://youtube.com/1',
    githubUrl: 'https://github.com/1',
    linkedinUrl: 'https://linkedin.com/1',
  }

  test('it should update a user profile by id, if the logged user is authorized (admin only)',
    async ({ client, assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const updatePath = Route.makeUrl('profiles.update', { id: TEST_USER_ID })
      const getPath = Route.makeUrl('profiles.show', { id: TEST_USER_ID })

      const preUpdateData = await client.get(getPath).loginAs(admin)
      const { updatedAt } = preUpdateData.body()

      const response = await client.patch(updatePath)
        .json(payload)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.OK)

      const data = response.body()

      assert.notPropertyVal(data, 'updatedAt', updatedAt)

      const props = Object.keys(payload)

      props.forEach(prop => assert.equal(payload[prop], data[prop]))
    })

  test('it should update a user profile by id, if the logged user id and the targeted id are the same',
    async ({ client, assert }) => {
      const user = await UserFactory.with('profile').create()

      const updatePath = Route.makeUrl('profiles.update', { id: user.id })
      const getPath = Route.makeUrl('profiles.show', { id: user.id })

      const preUpdateData = await client.get(getPath).loginAs(user)
      const { updatedAt } = preUpdateData.body()

      const response = await client.patch(updatePath)
        .json(payload)
        .guard('api')
        .loginAs(user)

      response.assertStatus(StatusCodes.OK)

      const data = response.body()

      assert.notPropertyVal(data, 'updatedAt', updatedAt)
      const props = Object.keys(payload)

      props.forEach(prop => assert.equal(payload[prop], data[prop]))
    })

  test('it should return error (401 UNAUTHORIZED) if the user is not authenticated',
    async ({ client }) => {
      const path = Route.makeUrl('profiles.update', { id: TEST_USER_ID })

      const response = await client
        .patch(path)
        .json(payload)

      response.assertStatus(StatusCodes.UNAUTHORIZED)

      response.assertTextIncludes('E_UNAUTHORIZED_ACCESS')
    })

  test('it should return error (404 NOT FOUND), if the logged user is authorized, but the target id is invalid',
    async ({ client }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)

      const invalidId = 99999
      const path = Route.makeUrl('profiles.update', { id: invalidId })

      const response = await client
        .patch(path)
        .json(payload)
        .guard('api')
        .loginAs(admin)

      response.assertStatus(StatusCodes.NOT_FOUND)
      response.assertTextIncludes('NOT_FOUND')
    })
})
