import { test } from '@japa/runner'
import { User } from 'App/Models'
import UserPolicy from 'App/Policies/UserPolicy'
import UserFactory from 'Database/factories/UserFactory'
import { TEST_ADMIN_ID, TEST_USER_ID } from 'Shared/const'

test.group('Policies: Get all users', () => {
  test('it should return true if the user is admin', async ({ assert }) => {
    const admin = await User.findOrFail(TEST_ADMIN_ID)

    assert.isTrue(new UserPolicy().getAllUsers(admin))
  })

  test('it should return false if the user is not admin', async ({ assert }) => {
    const user = await UserFactory.create()

    assert.isFalse(new UserPolicy().getAllUsers(user))
  })
})

test.group('Policies: Get user by id', () => {
  test('it should return true, if the user is not admin but the target id is equal with the logged user id',
    async ({ assert }) => {
      const user = await UserFactory.create()
      const { id: targetId } = user

      assert.isTrue(new UserPolicy().getUserById(user, targetId))
    })

  test('it should return true, if the user is admin but the target id is different from the logged user id',
    async ({ assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const { id: targetId } = await UserFactory.create()

      assert.isTrue(new UserPolicy().getUserById(admin, targetId))
    })

  test('it should return false if the user is not admin and the target id is different from the logged user id',
    async ({ assert }) => {
      const user = await UserFactory.create()
      const { id: targetId } = await User.findOrFail(TEST_USER_ID)

      assert.isFalse(new UserPolicy().getUserById(user, targetId))
    })
})

test.group('Policies: Update user by id', () => {
  test('it should return true, if the user is not admin but the target id is equal with the logged user id',
    async ({ assert }) => {
      const user = await UserFactory.create()
      const { id: targetId } = user

      assert.isTrue(new UserPolicy().updateUserById(user, targetId))
    })

  test('it should return true, if the user is admin but the target id is different from the logged user id',
    async ({ assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const { id: targetId } = await UserFactory.create()

      assert.isTrue(new UserPolicy().updateUserById(admin, targetId))
    })

  test('it should return false if the user is not admin and the target id is different from the logged user id',
    async ({ assert }) => {
      const user = await UserFactory.create()
      const { id: targetId } = await User.findOrFail(TEST_USER_ID)

      assert.isFalse(new UserPolicy().updateUserById(user, targetId))
    })
})

test.group('Policies: Delete user by id', () => {
  test('it should return true, if the user is not admin but the target id is equal with the logged user id',
    async ({ assert }) => {
      const user = await UserFactory.create()
      const { id: targetId } = user

      assert.isTrue(new UserPolicy().deleteUserById(user, targetId))
    })

  test('it should return true, if the user is admin but the target id is different from the logged user id',
    async ({ assert }) => {
      const admin = await User.findOrFail(TEST_ADMIN_ID)
      const { id: targetId } = await UserFactory.create()

      assert.isTrue(new UserPolicy().deleteUserById(admin, targetId))
    })

  test('it should return false if the user is not admin and the target id is different from the logged user id',
    async ({ assert }) => {
      const user = await UserFactory.create()
      const { id: targetId } = await User.findOrFail(TEST_USER_ID)

      assert.isFalse(new UserPolicy().deleteUserById(user, targetId))
    })
})
