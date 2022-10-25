import Route from '@ioc:Adonis/Core/Route'

import { ROUTE_PREFIX } from './utils/route.constants'

const prefix = `${ROUTE_PREFIX}/users`

Route
  .group(() => {
    Route.post('/', 'UsersController.createNewUser')

    Route
      .group(() => {
        Route.get('/', 'UsersController.getAllUsers')

        Route
          .group(() => {
            Route.get(':id', 'UsersController.getUserById')
            Route.patch(':id', 'UsersController.updateUserById')
            Route.delete(':id', 'UsersController.deleteUserById')

            Route.get('/', 'UsersController.getUserAccount')
            Route.patch('/', 'UsersController.updateUser')
            Route.delete('/', 'UsersController.deleteUser')
          })
          .prefix('account')
      })
      .middleware('auth')
  })
  .prefix(prefix)
