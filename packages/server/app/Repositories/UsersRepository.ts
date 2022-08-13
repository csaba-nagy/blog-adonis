import { User } from 'App/Models'

export class UsersRepository {
  public async getUsers() {
    return await User.all()
  }

  public async getUserById(id: number) {
    return await User.findByOrFail('id', id)
  }

  public async createUser(userData) {
    return await User.create(userData)
  }

  public async updateUser(userData) {
    const user = await User.findByOrFail('id', userData.id)

    const updatedUser = await user.merge({
      ...userData,
    }).save()

    return updatedUser
  }

  public async deleteUser(id: number) {
    const user = await User.findByOrFail('id', id)
    await user.delete()
  }
}
