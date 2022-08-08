import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRepository } from 'App/Repositories'
import { CreateUserValidator, UpdateUserValidator } from 'App/Validators'
import { StatusCodes } from 'App/Enums'

export class UsersController {
  public async getAllUsers({ response }) {
    const users = await new UsersRepository().getUsers()

    response.status(StatusCodes.OK).send(users)
  }

  public async getUserById({ request, response }: HttpContextContract) {
    const user = await new UsersRepository().getUserById(request.param('id'))

    response.status(StatusCodes.OK).send(user)
  }

  public async createNewUser({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)

    const user = await new UsersRepository().createUser(payload)

    response.status(StatusCodes.CREATED).send(user)
  }

  public async updateUser({ request, response }: HttpContextContract) {
    const validatedData = await request.validate(UpdateUserValidator)
    const payload = {
      id: request.param('id'),
      ...validatedData,
    }
    const updatedUser = await new UsersRepository().updateUser(payload)

    response.status(StatusCodes.OK).send(updatedUser)
  }

  public async deleteUser({ request, response }: HttpContextContract) {
    await new UsersRepository().deleteUser(request.param('id'))

    response.status(StatusCodes.OK)
  }
}
