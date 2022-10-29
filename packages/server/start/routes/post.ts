import Route from '@ioc:Adonis/Core/Route'

import { ROUTE_PREFIX } from './utils/route.constants'

const prefix = `${ROUTE_PREFIX}/posts`

Route
  .group(() => {
    Route.get('/', 'PostsController.getPosts')

    Route.get(':slug', 'PostsController.getPostBySlug')

    Route
      .group(() => {
        Route.post('/', 'PostsController.createPost')

        Route
          .group(() => {
            Route.patch('/', 'PostsController.updatePost')
            Route.delete('/', 'PostsController.deletePost')

            Route.patch('/publish', 'PostsController.publishPost')
          })
          .prefix('/:slug')
      })
      .middleware('auth')
  })
  .prefix(prefix)
