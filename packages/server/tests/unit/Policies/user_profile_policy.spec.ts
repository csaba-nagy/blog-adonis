import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserProfile } from 'App/Models'
import UserProfilePolicy from 'App/Policies/UserProfilePolicy'
import UserFactory from 'Database/factories/UserFactory'
import { DB_CONNECTION, TEST_ADMIN_ID } from 'Shared/const'

test.group('Policies: Update user profile by id', () => {
  test('it should return false if the user is not admin', async ({ assert }) => {
    const user = await UserFactory.create() // the newly created user has "user" role by default

    assert.isFalse(new UserProfilePolicy().updateUserProfileById(user))
  })
})

test.group('Policies: View own profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return true if the user "id" and profile "userId" are the same',
    async ({ assert }) => {
      const user = await UserFactory.with('profile').create()

      const profile = await UserProfile.findByOrFail('user_id', user.$attributes.id)

      assert.isTrue(new UserProfilePolicy().viewOwnProfile(user, profile))
    })

  test('it should return false if the user "id" and profile "userId" are different',
    async ({ assert }) => {
      const user = await UserFactory.with('profile').create()
      const profile = await UserProfile.findOrFail(TEST_ADMIN_ID)

      assert.isFalse(new UserProfilePolicy().viewOwnProfile(user, profile))
    })
})

test.group('Policies: Update own profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction(DB_CONNECTION)
    return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
  })

  test('it should return true if the user "id" and profile "userId" are the same',
    async ({ assert }) => {
      const user = await UserFactory.with('profile').create()

      const profile = await UserProfile.findByOrFail('user_id', user.$attributes.id)

      assert.isTrue(new UserProfilePolicy().updateOwnProfile(user, profile))
    })

  test('it should return false if the user "id" and profile "userId" are different',
    async ({ assert }) => {
      const user = await UserFactory.with('profile').create()
      const profile = await UserProfile.findOrFail(TEST_ADMIN_ID)

      assert.isFalse(new UserProfilePolicy().updateOwnProfile(user, profile))
    })
})

test.group('Policies: View user profile by id', () => {
  test('it should return true', async ({ assert }) => {
    const user = await UserFactory.create()
    assert.isTrue(new UserProfilePolicy().viewProfileById(user))
  })
})
