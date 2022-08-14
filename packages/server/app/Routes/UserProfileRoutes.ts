import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import { UserProfilesController } from 'App/Controllers/Http'
import { RequestMethods } from 'App/Enums'

const userProfileController = new UserProfilesController()
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const userProfilesApiEndpoints = {
  home: '/users/profile',
  profile: '/users/profile/:id',
}

export const userProfileRoutes = Route.group(() => {
  Route.group(() => {
    Route[RequestMethods.GET](userProfilesApiEndpoints.profile, userProfileController.getUserProfileById)
    Route[RequestMethods.PATCH](userProfilesApiEndpoints.profile, userProfileController.updateUserProfile)
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
