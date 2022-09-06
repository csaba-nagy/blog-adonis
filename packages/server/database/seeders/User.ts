import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserFactory from 'Database/factories/UserFactory'

export default class extends BaseSeeder {
  public async run() {
    // It creates one admin account with the specified data
    await UserFactory.merge({
      // Override the default values what are declared in UserFactory
      firstName: 'Csaba',
      lastName: 'Nagy',
      email: 'admin@email.com',
      password: '!Password11',
    })
      .apply('role.admin')
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
