import Database from '@ioc:Adonis/Lucid/Database'
import { User } from 'App/Models'

export default class UsersRepository {
  public getUsers = async () => await User.all()

  public getUserById = async (id: number) => await User.findByOrFail('id', id)

  public getUserByEmail = async (email: string) => await User.findByOrFail('email', email)

  public createUser = async (userData) => {
    return await Database.transaction(async (trx) => {
      const user = await User.create(userData, { client: trx })
      await user.related('profile').create({})

      return user
    })
  }

  public updateUser = async (userData) => {
    return await Database.transaction(async (trx) => {
      const user = await User.findByOrFail('id', userData.id, { client: trx })

      return await user.merge({ ...userData }).save()
    })
  }

  public deleteUser = async (id: number) => {
    await Database.transaction(async (trx) => {
      const user = await User.findByOrFail('id', id, { client: trx })
      await user.delete()
    })
  }
}
