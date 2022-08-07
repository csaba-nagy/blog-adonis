import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserFactory from '../factories/UserFactory'

export default class extends BaseSeeder {
  public async run() {
    await UserFactory
    // Override the default values
      .merge({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'password',
      })
      .apply('role')
      .apply('status')
      .with('profile')
      .with('posts', 10)
      .create()

    await UserFactory
      // Apply the UserFactory state method
      .apply('status')
    // Set the given relation which is declared at UserFactory
      .with('profile')
      .createMany(10)
  }
}
