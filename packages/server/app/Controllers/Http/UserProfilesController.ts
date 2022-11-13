import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserProfilesRepository } from 'App/Repositories'
import { UserProfileValidator } from 'App/Validators'

export default class UserProfilesController {
  constructor(private repository = new UserProfilesRepository()) {}

  public async show({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('UserProfilePolicy').authorize('showProfileById')

    const id = request.param('id')

    const profile = await this.repository.getUserProfileByUserId(id)

    return response.ok(profile.serialize(this.getProfileSerializationOptions()))
  }

  public async update({ auth, request, response, bouncer }: HttpContextContract) {
    const targetId: number = request.param('id')
    const { id } = auth.user!

    await bouncer.with('UserProfilePolicy').authorize('updateProfileById', id)

    const validatedData = await request.validate(UserProfileValidator)

    const updatedProfile = await this.repository.updateUserProfile(targetId, validatedData)

    return response.ok(updatedProfile.serialize(this.getProfileSerializationOptions()))
  }

  private getProfileSerializationOptions = () => {
    return {
      fields: {
        omit: ['id', 'created_at'],
      },
    }
  }
}
