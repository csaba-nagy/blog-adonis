import Route from '@ioc:Adonis/Core/Route'

import { ROUTE_PREFIX } from './utils/route.constants'

Route.group(() => Route
  .resource('profiles', 'UserProfilesController')
  .only(['show', 'update'])
  .middleware({
    show: ['auth'],
    update: ['auth'],
  }))
  .prefix(ROUTE_PREFIX)
