import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRepository } from 'App/Repositories'
import { CreateUserValidator, UpdateUserAsAdminValidator, UpdateUserValidator } from 'App/Validators'
import { StatusCodes } from 'App/Enums'

export default class UsersController {
  constructor(private repository = new UsersRepository()) {}

  public createNewUser = async ({ request, response }: HttpContextContract) => {
    const payload = await request.validate(CreateUserValidator)
    const user = await this.repository.createUser(payload)

    return response.created(user.serialize(this.getUserDataSerializationOptions('create')))
  }

  public getAllUsers = async ({ bouncer, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('getAllUsers')

    const users = await this.repository.getUsers()

    return response.ok(users.map(user => user.serialize(this.getUserDataSerializationOptions('getAll'))))
  }

  public getUserById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('getUserById')

    const user = await this.repository.getUserById(request.param('id'))

    return response.ok(user.serialize(this.getUserDataSerializationOptions('getOne')))
  }

  public getUserAccount = async ({ auth, response }: HttpContextContract) => {
    const user = await this.repository.getUserById(auth.user!.id)

    return response.ok(user.serialize(this.getUserDataSerializationOptions('getOne')))
  }

  public updateUserById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('updateUserById')

    const validatedData = await request.validate(UpdateUserAsAdminValidator)
    const payload = {
      id: request.param('id'),
      ...validatedData,
    }

    const updatedUser = await this.repository.updateUser(payload)

    return response.ok(updatedUser.serialize(this.getUserDataSerializationOptions('getOne')))
  }

  public updateUser = async ({ auth, request, response }: HttpContextContract) => {
    const { id: userId } = auth.user!
    const validatedData = await request.validate(UpdateUserValidator)
    const payload = {
      id: userId,
      ...validatedData,
    }

    const updatedUser = await this.repository.updateUser(payload)

    return response.ok(updatedUser.serialize(this.getUserDataSerializationOptions('getOne')))
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

  private getUserDataSerializationOptions = (method: 'create' | 'getAll' | 'getOne') => {
    if (method === 'create') {
      return {
        fields: {
          pick: ['name', 'profile', 'account'],
        },
      }
    }

    if (method === 'getAll') {
      return {
        fields: {
          omit: ['created_at', 'updated_at'],
        },
      }
    }
    return {
      fields: {
        omit: ['account'],
      },
    }
  }
}
