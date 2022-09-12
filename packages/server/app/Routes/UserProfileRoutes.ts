import Route from '@ioc:Adonis/Core/Route'
import { RequestMethods } from 'App/Enums'
import { API_BASE_ROUTE, API_VERSION, USERS_PATH } from './constants'

export const userProfilesApiEndpoints = {
  profile: '/profile',
  profileById: '/profile/:id',
}

export const userProfileRoutes = Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route[RequestMethods.GET](userProfilesApiEndpoints.profileById, 'UserProfilesController.getUserProfileById').middleware('auth')
      Route[RequestMethods.PATCH](userProfilesApiEndpoints.profileById, 'UserProfilesController.updateUserProfileById').middleware('auth')

      Route[RequestMethods.GET](userProfilesApiEndpoints.profile, 'UserProfilesController.getUserProfile').middleware('auth')
      Route[RequestMethods.PATCH](userProfilesApiEndpoints.profile, 'UserProfilesController.updateUserProfile').middleware('auth')
    }).prefix(USERS_PATH)
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
