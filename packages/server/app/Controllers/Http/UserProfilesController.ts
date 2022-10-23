import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { UserProfilesRepository } from 'App/Repositories'
import { UserProfileValidator } from 'App/Validators'

export default class UserProfilesController {
  constructor(private repository = new UserProfilesRepository()) {}

  public getUserProfile = async ({ auth, bouncer, response }: HttpContextContract) => {
    const { id } = await auth.user!

    const profile = await this.repository.getUserProfileByUserId(id)

    await bouncer.with('UserProfilePolicy').authorize('viewOwnProfile', profile)

    return response.ok(profile.serialize(this.getProfileSerializationOptions()))
  }

  public getUserProfileById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserProfilePolicy').authorize('viewProfileById')

    const profile = await this.repository.getUserProfileByUserId(request.param('id'))

    return response.ok(profile.serialize(this.getProfileSerializationOptions()))
  }

  public updateUserProfile = async ({ auth, bouncer, request, response }: HttpContextContract) => {
    const { id } = auth.user!

    // Need to query here for checking authorization 👇
    const profile = await this.repository.getUserProfileByUserId(id)

    await bouncer.with('UserProfilePolicy').authorize('updateOwnProfile', profile)

    const validatedData = await request.validate(UserProfileValidator)

    const updatedProfile = await this.repository.updateUserProfile(profile, validatedData)

    return response.ok(updatedProfile.serialize(this.getProfileSerializationOptions()))
  }

  public updateUserProfileById = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('UserProfilePolicy').authorize('updateUserProfileById')

    const id = request.param('id')
    const profile = await this.repository.getUserProfileByUserId(id)

    const validatedData = await request.validate(UserProfileValidator)

    const updatedProfile = await this.repository.updateUserProfile(profile, validatedData)

    response.ok(updatedProfile.serialize(this.getProfileSerializationOptions()))
  }

  private getProfileSerializationOptions = () => {
    return {
      fields: {
        omit: ['id', 'created_at'],
      },
    }
  }
}
