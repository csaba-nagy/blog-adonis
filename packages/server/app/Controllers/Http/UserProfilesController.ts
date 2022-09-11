import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { StatusCodes } from 'App/Enums'
import { UserProfilesRepository } from 'App/Repositories'
import { UserProfileValidator } from 'App/Validators'

export default class UserProfilesController {
  public async getOwnUserProfile({ auth, bouncer, response }: HttpContextContract) {
    const { id } = await auth.user!

    const profile = await new UserProfilesRepository().getUserProfile(id)

    await bouncer.with('UserProfilePolicy').authorize('viewOwnProfile', profile)

    return response.status(StatusCodes.OK).send(profile)
  }

  public async getUserProfileById({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('UserProfilePolicy').authorize('viewProfileById')

    const profile = await new UserProfilesRepository().getUserProfile(request.param('id'))

    response.status(StatusCodes.OK).send(profile)
  }

  public async updateUserProfile({ auth, bouncer, request, response }: HttpContextContract) {
    const { id } = auth.user!

    // It is necessary because of authorization
    const profile = await new UserProfilesRepository().getUserProfile(id)

    await bouncer.with('UserProfilePolicy').authorize('updateOwnProfile', profile)

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

  public async updateUserProfileById({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('UserProfilePolicy').authorize('updateUserProfileById')

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
