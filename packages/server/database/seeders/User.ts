import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserFactory from 'Database/factories/UserFactory'

export default class extends BaseSeeder {
  public async run() {
    // It creates one admin account with the specified data
    await UserFactory.merge({
      // Override the default values what are declared in UserFactory
      firstName: 'Test',
      lastName: 'Admin',
      email: 'testadmin@email.com',
      password: '!Password11',
    })
      .apply('role.admin')
      .apply('status.active')
      .with('profile')
      .with('posts', 1, post => post.apply('category.web_development').apply('state.public'))
      .create()

    await UserFactory.merge({
      // Override the default values what are declared in UserFactory
      firstName: 'Test',
      lastName: 'Author',
      email: 'testauthor@email.com',
      password: '!Password11',
    })
      .apply('role.author')
      .apply('status.active')
      .with('profile')
      .with('posts', 1)
      .with('posts', 10, post => post.apply('category.web_development').apply('state.public'))
      .create()

    await UserFactory.merge({
      // Override the default values what are declared in UserFactory
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@email.com',
      password: '!Password11',
    })
      .apply('status.active')
      .with('profile')
      .create()

    // It creates some author accounts
    await UserFactory
      .apply('role.author')
      .apply('status.active')
      .with('profile')
      .with('posts', 10)
      .createMany(3)

    // It creates some active user accounts
    await UserFactory
      // Apply the UserFactory state method
      .apply('status.active')
    // Set the given relation which is declared in UserFactory
      .with('profile')
      .createMany(10)

    // It creates some inactive (pending) user accounts
    await UserFactory.with('profile').createMany(10)

    // It creates some suspended user accounts
    await UserFactory
      .apply('status.suspended')
      .with('profile').createMany(5)
  }
}
