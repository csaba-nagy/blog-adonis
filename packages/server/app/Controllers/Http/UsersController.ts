import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRepository } from 'App/Repositories'
import { CreateUserValidator, UpdateUserAsAdminValidator, UpdateUserValidator } from 'App/Validators'
import { StatusCodes } from 'App/Enums'

export class UsersController {
  public async createNewUser({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)

    const user = await new UsersRepository().createUser(payload)

    response.status(StatusCodes.CREATED).send(user)
  }

  public async getAllUsers({ response }) {
    const users = await new UsersRepository().getUsers()

    response.status(StatusCodes.OK).send(users)
  }

  public async getUserById({ request, response }: HttpContextContract) {
    const user = await new UsersRepository().getUserById(request.param('id'))

    response.status(StatusCodes.OK).send(user)
  }

  public async getUserAccount({ auth, response }: HttpContextContract) {
    const { id } = auth.user!
    const user = await new UsersRepository().getUserById(id)

    response.status(StatusCodes.OK).send(user)
  }

  public async updateUser({ request, response }: HttpContextContract) {
    const validatedData = await request.validate(UpdateUserAsAdminValidator)
    const payload = {
      id: request.param('id'),
      ...validatedData,
    }
    const updatedUser = await new UsersRepository().updateUser(payload)

    response.status(StatusCodes.OK).send(updatedUser)
  }

  public async updateUserOwnData({ auth, request, response }: HttpContextContract) {
    const { id: userId } = auth.user!
    const validatedData = await request.validate(UpdateUserValidator)
    const payload = {
      id: userId,
      ...validatedData,
    }
    const updatedUser = await new UsersRepository().updateUser(payload)

    response.status(StatusCodes.OK).send(updatedUser)
  }

  public async deleteUser({ request, response }: HttpContextContract) {
    await new UsersRepository().deleteUser(request.param('id'))

    response.status(StatusCodes.OK)
  }

  public async deleteUserByItself({ auth, response }: HttpContextContract) {
    const { id } = await auth.user!

    await new UsersRepository().deleteUser(id)

    response.status(StatusCodes.OK)
  }
}
