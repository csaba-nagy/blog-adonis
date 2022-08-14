import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { DB_CONNECTION, USER_PATH_WITH_ID, USER_PROFILE_PATH_WITH_ID } from './constantsForTesting'

test.group('Delete user and profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('DELETE /users/:id', async ({ client }) => {
    const response = await client.delete(USER_PATH_WITH_ID)

    response.assertStatus(StatusCodes.OK)

    const responseToGetDeletedUser = await client.get(USER_PATH_WITH_ID)

    responseToGetDeletedUser.assertStatus(StatusCodes.NOT_FOUND)

    const responseToGetDeletedProfile = await client.get(USER_PROFILE_PATH_WITH_ID)

    responseToGetDeletedProfile.assertStatus(StatusCodes.NOT_FOUND)
  })
})
