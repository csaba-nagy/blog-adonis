import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { StatusCodes } from 'App/Enums'
import { UserProfilesRepository } from 'App/Repositories'
import { UserProfileValidator } from 'App/Validators'

export class UserProfilesController {
  public async getOwnUserProfile({ auth, response }: HttpContextContract) {
    const user = await auth.user!
    const profile = await new UserProfilesRepository().getUserProfile(user.id)

    return response.status(StatusCodes.OK).send({ userData: user, profileData: profile })
  }

  public async getUserProfileById({ request, response }: HttpContextContract) {
    const profile = await new UserProfilesRepository().getUserProfile(request.param('id'))

    response.status(StatusCodes.OK).send(profile)
  }

  public async updateUserProfile({ auth, request, response }: HttpContextContract) {
    const { id } = await auth.user!
    const validatedData = await request.validate(UserProfileValidator)
    const payload = {
      userId: id,
      data: {
        ...validatedData,
      },
    }
    const updatedProfile = await new UserProfilesRepository().updateUserProfile(payload)

    response.status(StatusCodes.OK).send(updatedProfile)
  }

  public async updateUserProfileById({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const validatedData = await request.validate(UserProfileValidator)
    const payload = {
      userId: id,
      data: {
        ...validatedData,
      },
    }

    const updatedProfile = await new UserProfilesRepository().updateUserProfile(payload)

    response.status(StatusCodes.OK).send(updatedProfile)
  }
}
