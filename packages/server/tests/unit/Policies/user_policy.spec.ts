import { test } from '@japa/runner'
import UserPolicy from 'App/Policies/UserPolicy'
import UserFactory from 'Database/factories/UserFactory'

test.group('Policies: Get all users', () => {
  test('it should return false if the user is not admin', async ({ assert }) => {
    const user = await UserFactory.create()

    assert.isFalse(new UserPolicy().getAllUsers(user))
  })
})

test.group('Policies: Get user by id', () => {
  test('it should return false if the user is not admin', async ({ assert }) => {
    const user = await UserFactory.create()

    assert.isFalse(new UserPolicy().getUserById(user))
  })
})

test.group('Policies: Update user by id', () => {
  test('it should return false if the user is not admin', async ({ assert }) => {
    const user = await UserFactory.create()

    assert.isFalse(new UserPolicy().updateUserById(user))
  })
})

test.group('Policies: Delete user by id', () => {
  test('it should return false if the user is not admin', async ({ assert }) => {
    const user = await UserFactory.create()

    assert.isFalse(new UserPolicy().deleteUserById(user))
  })
})
