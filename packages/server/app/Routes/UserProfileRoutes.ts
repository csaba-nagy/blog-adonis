import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import { UserProfilesController } from 'App/Controllers/Http'
import { RequestMethods } from 'App/Enums'

const userProfileController = new UserProfilesController()
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const userProfilesApiEndpoints = {
  profile: '/profile',
  profileById: '/profile/:id',
}

export const userProfileRoutes = Route.group(() => {
  Route.group(() => {
    // TODO: Admin only
    Route[RequestMethods.GET](userProfilesApiEndpoints.profileById, userProfileController.getUserProfileById)
    Route[RequestMethods.PATCH](userProfilesApiEndpoints.profileById, userProfileController.updateUserProfileById)

    // For users
    Route[RequestMethods.GET](userProfilesApiEndpoints.profile, userProfileController.getOwnUserProfile)
    Route[RequestMethods.PATCH](userProfilesApiEndpoints.profile, userProfileController.updateUserProfile)
  }).prefix(API_VERSION).middleware('auth')
}).prefix(API_BASE_ROUTE)
