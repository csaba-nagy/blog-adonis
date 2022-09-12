import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { InvalidCredentialException } from 'App/Exceptions'
import { UsersRepository } from 'App/Repositories'
import { AuthValidator } from 'App/Validators'

export default class AuthController {
  constructor(private repository = new UsersRepository()) {}

  public login = async ({ auth, request, response }: HttpContextContract) => {
    const { email, password } = await request.validate(AuthValidator)

    try {
      const user = await this.repository.getUserByEmail(email)

      if (!await Hash.verify(user.password, password))
        throw new InvalidCredentialException()

      const token = await auth.use('api').generate(user, { expiresIn: '1h' })

      return response.cookie('token', token).ok(token)
    }
    catch (Exception) {
      throw new InvalidCredentialException()
    }
  }

  public logout = async ({ auth, response }: HttpContextContract) => {
    await auth.use('api').revoke()

    return response.clearCookie('token').ok({ revoked: true })
  }
}
