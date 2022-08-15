import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { StatusCodes } from 'App/Enums'
import { DB_CONNECTION, USER_PATH_WITH_ID } from './constantsForTesting'

test.group('Update user', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })
  test('PATCH /users/:id', async ({ client, assert }) => {
    const updatedUserData = {
      firstName: 'Test',
      lastName: 'Testing',
    }

    const preUpdateData = await client.get(USER_PATH_WITH_ID)
    const { updated_at } = preUpdateData.body()

    const response = await client.patch(USER_PATH_WITH_ID).json(updatedUserData)

    response.assertStatus(StatusCodes.OK)

    assert.notPropertyVal(response.body(), 'updated_at', updated_at)
    assert.properties(response.body(), ['id', 'first_name', 'last_name', 'email', 'created_at', 'updated_at'])

    assert.notProperty(response.body(), 'password')

    const getUpdatedUser = await client.get(USER_PATH_WITH_ID)

    assert.propertyVal(getUpdatedUser.body(), 'first_name', updatedUserData.firstName)
    assert.propertyVal(getUpdatedUser.body(), 'last_name', updatedUserData.lastName)
  })
})
