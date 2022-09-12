import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRepository } from 'App/Repositories'
import { CreateUserValidator, UpdateUserAsAdminValidator, UpdateUserValidator } from 'App/Validators'
import { StatusCodes } from 'App/Enums'

export default class UsersController {
  constructor(private repository = new UsersRepository()) {}

  public createNewUser = async ({ request, response }: HttpContextContract) => {
    const payload = await request.validate(CreateUserValidator)
    const user = await this.repository.createUser(payload)

    return response.created(user)
  }

  public getAllUsers = async ({ bouncer, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('getAllUsers')

    const users = await this.repository.getUsers()

    return response.ok(users)
  }

  public getUserById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('getUserById')

    const user = await this.repository.getUserById(request.param('id'))

    return response.ok(user)
  }

  public getUserAccount = async ({ auth, response }: HttpContextContract) => {
    const user = await this.repository.getUserById(auth.user!.id)

    return response.ok(user)
  }

  public updateUserById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('updateUserById')

    const validatedData = await request.validate(UpdateUserAsAdminValidator)
    const payload = {
      id: request.param('id'),
      ...validatedData,
    }

    const updatedUser = await this.repository.updateUser(payload)

    return response.ok(updatedUser)
  }

  public updateUser = async ({ auth, request, response }: HttpContextContract) => {
    const { id: userId } = auth.user!
    const validatedData = await request.validate(UpdateUserValidator)
    const payload = {
      id: userId,
      ...validatedData,
    }

    const updatedUser = await this.repository.updateUser(payload)

    return response.ok(updatedUser)
  }

  public deleteUserById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('deleteUserById')

    await this.repository.deleteUser(request.param('id'))

    return response.status(StatusCodes.OK)
  }

  public deleteUser = async ({ auth, response }: HttpContextContract) => {
    await this.repository.deleteUser(auth.user!.id)

    return response.status(StatusCodes.OK)
  }
}
