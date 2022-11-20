import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRepository } from 'App/Repositories'
import { CreateUserValidator, UpdateUserValidator } from 'App/Validators'

export default class UsersController {
  constructor(private repository = new UsersRepository()) {}

  public store = async ({ request, response }: HttpContextContract) => {
    const payload = await request.validate(CreateUserValidator)
    const user = await this.repository.createUser(payload)

    return response.created(user.serialize(this.getUserDataSerializationOptions('store')))
  }

  public index = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserPolicy').authorize('getAllUsers')

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const users = await this.repository.getUsers(page, limit)

    return response.ok(users.serialize(this.getUserDataSerializationOptions('index')))
  }

  public show = async ({ bouncer, request, response }: HttpContextContract) => {
    const targetId = request.param('id')

    await bouncer.with('UserPolicy').authorize('getUserById', targetId)

    const user = await this.repository.getUserById(targetId)

    return response.ok(user.serialize(this.getUserDataSerializationOptions('show')))
  }

  public update = async ({ bouncer, request, response }: HttpContextContract) => {
    const targetId = request.param('id')

    await bouncer.with('UserPolicy').authorize('updateUserById', targetId)

    const validatedData = await request.validate(UpdateUserValidator)

    const updatedUser = await this.repository.updateUser(targetId, validatedData)

    return response.ok(updatedUser.serialize(this.getUserDataSerializationOptions('show')))
  }

  public destroy = async ({ bouncer, request, response }: HttpContextContract) => {
    const targetId = request.param('id')

    await bouncer.with('UserPolicy').authorize('deleteUserById', targetId)

    await this.repository.deleteUser(targetId)

    return response.noContent()
  }

  private getUserDataSerializationOptions = (method: 'store' | 'index' | 'show') => {
    if (method === 'store') {
      return {
        fields: {
          pick: ['id', 'name', 'profile', 'account'],
        },
      }
    }

    if (method === 'index') {
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
