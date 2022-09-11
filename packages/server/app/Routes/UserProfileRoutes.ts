import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import { RequestMethods } from 'App/Enums'

const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const userProfilesApiEndpoints = {
  profile: '/profile',
  profileById: '/profile/:id',
}

export const userProfileRoutes = Route.group(() => {
  Route.group(() => {
    Route[RequestMethods.GET](userProfilesApiEndpoints.profileById, 'UserProfilesController.getUserProfileById')
    Route[RequestMethods.PATCH](userProfilesApiEndpoints.profileById, 'UserProfilesController.updateUserProfileById')

    Route[RequestMethods.GET](userProfilesApiEndpoints.profile, 'UserProfilesController.getUserProfile')
    Route[RequestMethods.PATCH](userProfilesApiEndpoints.profile, 'UserProfilesController.updateUserProfile')
  }).prefix(API_VERSION).middleware('auth')
}).prefix(API_BASE_ROUTE)
