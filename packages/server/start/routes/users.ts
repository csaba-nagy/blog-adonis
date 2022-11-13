import Route from '@ioc:Adonis/Core/Route'

import { ROUTE_PREFIX } from './utils/route.constants'

Route.group(() => Route
  .resource('users', 'UsersController')
  .apiOnly()
  .middleware({
    index: ['auth'],
    show: ['auth'],
    update: ['auth'],
    destroy: ['auth'],
  }))
  .prefix(ROUTE_PREFIX)
