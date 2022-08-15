import Database from '@ioc:Adonis/Lucid/Database'
import { User } from 'App/Models'

export class UsersRepository {
  public async getUsers() {
    return await User.all()
  }

  public async getUserById(id: number) {
    return await User.findByOrFail('id', id)
  }

  public async createUser(userData) {
    const createdUser = await Database.transaction(async (trx) => {
      const user = await User.create(userData, { client: trx })
      await user.related('profile').create({})

      return user
    })

    return createdUser
  }

  public async updateUser(userData) {
    const updatedUser = await Database.transaction(async (trx) => {
      const user = await User.findByOrFail('id', userData.id, { client: trx })

      const updatedUserData = await user.merge({
        ...userData,
      }).save()

      return updatedUserData
    })

    return updatedUser
  }

  public async deleteUser(id: number) {
    await Database.transaction(async (trx) => {
      const user = await User.findByOrFail('id', id, { client: trx })
      await user.delete()
    })
  }
}
