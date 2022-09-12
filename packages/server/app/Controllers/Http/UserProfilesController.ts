import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { UserProfilesRepository } from 'App/Repositories'
import { UserProfileValidator } from 'App/Validators'

export default class UserProfilesController {
  constructor(private repository = new UserProfilesRepository()) {}

  public getUserProfile = async ({ auth, bouncer, response }: HttpContextContract) => {
    const { id } = await auth.user!

    const profile = await this.repository.getUserProfile(id)

    await bouncer.with('UserProfilePolicy').authorize('viewOwnProfile', profile)

    return response.ok(profile)
  }

  public getUserProfileById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserProfilePolicy').authorize('viewProfileById')

    const profile = await this.repository.getUserProfile(request.param('id'))

    return response.ok(profile)
  }

  public updateUserProfile = async ({ auth, bouncer, request, response }: HttpContextContract) => {
    const { id } = auth.user!

    // It is necessary because of authorization
    const profile = await this.repository.getUserProfile(id)

    await bouncer.with('UserProfilePolicy').authorize('updateOwnProfile', profile)

    const validatedData = await request.validate(UserProfileValidator)
    const payload = {
      userId: id,
      data: {
        ...validatedData,
      },
    }
    const updatedProfile = await this.repository.updateUserProfile(payload)

    return response.ok(updatedProfile)
  }

  public updateUserProfileById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserProfilePolicy').authorize('updateUserProfileById')

    const id = request.param('id')
    const validatedData = await request.validate(UserProfileValidator)
    const payload = {
      userId: id,
      data: {
        ...validatedData,
      },
    }

    const updatedProfile = await this.repository.updateUserProfile(payload)

    response.ok(updatedProfile)
  }
}
