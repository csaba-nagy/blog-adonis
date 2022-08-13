import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes } from 'App/Enums'
import { DB_CONNECTION, TEST_USER_ID, USER_PATH_WITH_ID } from './constantsForTesting'

test.group('Get user by id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('GET /users/:id', async ({ client, assert }) => {
    const response = await client.get(USER_PATH_WITH_ID)

    // Expected Status Code is 200
    response.assertStatus(StatusCodes.OK)

    // Need to return the following props: id, firstName, lastName, email, role, status, createdAt, updatedAt
    assert.properties(response.body(), ['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at', 'updated_at'])

    // Returning the password is not allowed
    assert.notProperty(response.body(), 'password')

    assert.propertyVal(response.body(), 'id', TEST_USER_ID)
  })
})
