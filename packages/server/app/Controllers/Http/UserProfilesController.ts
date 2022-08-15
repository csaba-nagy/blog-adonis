import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { StatusCodes } from 'App/Enums'
import { UserProfilesRepository } from 'App/Repositories'
import { UserProfileValidator } from 'App/Validators'

export class UserProfilesController {
  // TODO: Need to modify when authentication is done
  public async getUserProfileById({ request, response }: HttpContextContract) {
    const profile = await new UserProfilesRepository().getUserProfile(request.param('id'))

    response.status(StatusCodes.OK).send(profile)
  }

  public async updateUserProfile({ request, response }: HttpContextContract) {
    const validatedData = await request.validate(UserProfileValidator)
    const payload = {
      userId: request.param('id'),
      ...validatedData,
    }
    const updatedProfile = await new UserProfilesRepository().updateUserProfile(payload)

    response.status(StatusCodes.OK).send(updatedProfile)
  }
}
