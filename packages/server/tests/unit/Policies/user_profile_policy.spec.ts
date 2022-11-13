import { test } from '@japa/runner'
import { User } from 'App/Models'
import UserProfilePolicy from 'App/Policies/UserProfilePolicy'
import UserFactory from 'Database/factories/UserFactory'
import { TEST_ADMIN_ID, TEST_USER_ID } from 'Shared/const'

test.group('Policies: Update profile by id', () => {
  test('it should return false, if the logged user is NOT admin',
    async ({ assert }) => {
      const user = await UserFactory.create() // the newly created user has "user" role by default

      assert.isFalse(new UserProfilePolicy().updateProfileById(user, TEST_USER_ID))
    })

  test('it should return true, if the logged user is admin', async ({ assert }) => {
    const admin = await User.findOrFail(TEST_ADMIN_ID)

    assert.isTrue(new UserProfilePolicy().updateProfileById(admin, TEST_USER_ID))
  })

  test('it should return true, if the logged user id and target id are the same',
    async ({ assert }) => {
      const user = await UserFactory.with('profile').create()

      assert.isTrue(new UserProfilePolicy().updateProfileById(user, user.id))
    })

  test('it should return false, if the logged user id and target id are NOT the same',
    async ({ assert }) => {
      const user = await UserFactory.with('profile').create()

      assert.isFalse(new UserProfilePolicy().updateProfileById(user, TEST_USER_ID))
    })
})

test.group('Policies: View profile', () => {
  test('it should return true',
    async ({ assert }) => {
      const user = await UserFactory.with('profile').create()

      assert.isTrue(new UserProfilePolicy().showProfileById(user))
    })
})
