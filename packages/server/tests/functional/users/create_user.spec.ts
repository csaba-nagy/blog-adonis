import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StatusCodes } from 'App/Enums'
import { DB_CONNECTION, USERS_PATH, USER_PROFILE_PATH } from './constantsForTesting'

test.group('Create user and profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })
  test('POST /users', async ({ client, assert }) => {
    const testUserData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@email.com',
      password: 'testpassword',
    }

    const response = await client.post(USERS_PATH).json(testUserData)

    // Expected Status Code: 201
    response.assertStatus(StatusCodes.CREATED)

    // Need to return id, firstName, lastName, email, createdAt, updatedAt props
    assert.properties(response.body(), ['id', 'first_name', 'last_name', 'email', 'created_at', 'updated_at'])

    // Returning password is not allowed
    assert.notProperty(response.body(), 'password')

    // Check that the newly created user is exists in the database
    const getCreateduser = await client.get(`${USERS_PATH}/${response.body().id}`)

    getCreateduser.assertStatus(StatusCodes.OK)

    // Check the created user has the proper data
    assert.propertyVal(getCreateduser.body(), 'first_name', testUserData.firstName)
    assert.propertyVal(getCreateduser.body(), 'last_name', testUserData.lastName)
    assert.propertyVal(getCreateduser.body(), 'email', testUserData.email)

    // Check the User profile is created as well
    const { id } = getCreateduser.body()
    const profile = await client.get(`${USER_PROFILE_PATH}/${id}`)

    profile.assertStatus(StatusCodes.OK)

    assert.propertyVal(profile.body(), 'user_id', id)
  })
})
