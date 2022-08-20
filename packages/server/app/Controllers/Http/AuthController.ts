import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRepository } from 'App/Repositories'
import { AuthValidator } from 'App/Validators'

export class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate(AuthValidator)

    const user = await new UsersRepository().getUserByEmail(email)

    if (!await Hash.verify(user.password, password))
      return response.unauthorized('Invalid credentials')

    const token = await auth.use('api').generate(user, { expiresIn: '1h' })

    return response.cookie('token', token).ok(token)
  }

  public async logout({ auth, response }) {
    await auth.use('api').revoke()

    return response.clearCookie('token').ok({ revoked: true })
  }
}
