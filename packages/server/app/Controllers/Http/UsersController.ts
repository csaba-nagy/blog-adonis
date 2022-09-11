import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRepository } from 'App/Repositories'
import { CreateUserValidator, UpdateUserAsAdminValidator, UpdateUserValidator } from 'App/Validators'
import { StatusCodes } from 'App/Enums'

export default class UsersController {
  public async createNewUser({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)

    const user = await new UsersRepository().createUser(payload)

    response.status(StatusCodes.CREATED).send(user)
  }

  public async getAllUsers({ bouncer, response }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('getAllUsers')

    const users = await new UsersRepository().getUsers()

    response.status(StatusCodes.OK).send(users)
  }

  public async getUserById({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('getUserById')

    const user = await new UsersRepository().getUserById(request.param('id'))

    response.status(StatusCodes.OK).send(user)
  }

  public async getUserAccount({ auth, response }: HttpContextContract) {
    const { id } = auth.user!
    const user = await new UsersRepository().getUserById(id)

    response.status(StatusCodes.OK).send(user)
  }

  public async updateUserById({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('updateUserById')

    const validatedData = await request.validate(UpdateUserAsAdminValidator)
    const payload = {
      id: request.param('id'),
      ...validatedData,
    }
    const updatedUser = await new UsersRepository().updateUser(payload)

    response.status(StatusCodes.OK).send(updatedUser)
  }

  public async updateUser({ auth, request, response }: HttpContextContract) {
    const { id: userId } = auth.user!
    const validatedData = await request.validate(UpdateUserValidator)
    const payload = {
      id: userId,
      ...validatedData,
    }
    const updatedUser = await new UsersRepository().updateUser(payload)

    response.status(StatusCodes.OK).send(updatedUser)
  }

  public async deleteUserById({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('deleteUserById')

    await new UsersRepository().deleteUser(request.param('id'))

    response.status(StatusCodes.OK)
  }

  public async deleteUser({ auth, response }: HttpContextContract) {
    const { id } = await auth.user!

    await new UsersRepository().deleteUser(id)

    response.status(StatusCodes.OK)
  }
}
