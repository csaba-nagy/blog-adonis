import Database from '@ioc:Adonis/Lucid/Database'
import type { ModelAdapterOptions } from '@ioc:Adonis/Lucid/Orm'
import { User } from 'App/Models'

export default class UsersRepository {
  public getUsers = () => User.all()

  public getUserById = (id: number, options?: ModelAdapterOptions) =>
    User.findOrFail(id, options)

  public getUserByEmail = (email: string) => User.findByOrFail('email', email)

  public createUser = (payload) => {
    return Database.transaction(async (trx) => {
      const user = await User.create(payload, { client: trx })

      await user.related('profile').create({})

      return user
    })
  }

  public updateUser = (payload) => {
    return Database.transaction(async (trx) => {
      const user = await this.getUserById(payload.id, { client: trx })

      return await user.merge({ ...payload }).save()
    })
  }

  public deleteUser = (id: number) => {
    return Database.transaction(async (trx) => {
      const user = await this.getUserById(id, { client: trx })
      await user.delete()
    })
  }
}
