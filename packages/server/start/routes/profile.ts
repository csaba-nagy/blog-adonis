import Route from '@ioc:Adonis/Core/Route'

import { ROUTE_PREFIX } from './utils/route.constants'

const prefix = `${ROUTE_PREFIX}/users`

Route
  .group(() => {
    Route.get('profile/:id', 'UserProfilesController.getUserProfileById')
    Route.patch('profile/:id', 'UserProfilesController.updateUserProfileById')

    Route.get('profile', 'UserProfilesController.getUserProfile')
    Route.patch('profile', 'UserProfilesController.updateUserProfile')
  })
  .prefix(prefix)
  .middleware('auth')
