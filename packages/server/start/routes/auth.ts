import Route from '@ioc:Adonis/Core/Route'

import { ROUTE_PREFIX } from './utils/route.constants'

const prefix = `${ROUTE_PREFIX}/auth`

Route
  .group(() => {
    Route.post('login', 'AuthController.login')

    Route.get('logout', 'AuthController.logout').middleware('auth')
  })
  .prefix(prefix)
