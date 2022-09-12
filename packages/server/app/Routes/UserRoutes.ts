import Route from '@ioc:Adonis/Core/Route'
import { RequestMethods } from 'App/Enums'
import { API_BASE_ROUTE, API_VERSION, USERS_PATH } from './constants'

export const userApiEndPoints = {
  users: '/',
  account: '/account',
  accountById: '/account/:id',
}

export const userRoutes = Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route[RequestMethods.GET](userApiEndPoints.users, 'UsersController.getAllUsers').middleware('auth')
      Route[RequestMethods.GET](userApiEndPoints.accountById, 'UsersController.getUserById').middleware('auth')
      Route[RequestMethods.PATCH](userApiEndPoints.accountById, 'UsersController.updateUserById').middleware('auth')
      Route[RequestMethods.DELETE](userApiEndPoints.accountById, 'UsersController.deleteUserById').middleware('auth')

      Route[RequestMethods.POST](userApiEndPoints.users, 'UsersController.createNewUser')
      Route[RequestMethods.GET](userApiEndPoints.account, 'UsersController.getUserAccount').middleware('auth')
      Route[RequestMethods.PATCH](userApiEndPoints.account, 'UsersController.updateUser').middleware('auth')
      Route[RequestMethods.DELETE](userApiEndPoints.account, 'UsersController.deleteUser').middleware('auth')
    }).prefix(USERS_PATH)
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
