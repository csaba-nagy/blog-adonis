import Route from '@ioc:Adonis/Core/Route'

import { ROUTE_PREFIX } from './utils/route.constants'

Route.group(() => Route
  .resource('posts', 'PostsController')
  .apiOnly()
  .paramFor('posts', 'slug')
  .middleware({
    store: ['auth'],
    update: ['auth'],
    destroy: ['auth'],
  })
  .where('slug', /^[a-z0-9_-]+$/))
  .prefix(ROUTE_PREFIX)
