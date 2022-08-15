import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { DB_CONNECTION, USER_PROFILE_PATH_WITH_ID } from '../constantsForTesting'

test.group('Update user profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('PATCH /users/profile/:id', async ({ client, assert }) => {
    const updateProfileData = {
      biography: 'lorem ipsum dolor sit amet',
    }

    const preUpdateData = await client.get(USER_PROFILE_PATH_WITH_ID)
    const { updated_at } = preUpdateData.body()

    const response = await client.patch(USER_PROFILE_PATH_WITH_ID).json(updateProfileData)

    response.assertStatus(StatusCodes.OK)

    assert.notPropertyVal(response.body(), 'updated_at', updated_at)

    assert.propertyVal(response.body(), 'biography', updateProfileData.biography)
  })
})
