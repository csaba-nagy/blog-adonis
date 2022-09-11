import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import { RequestMethods } from 'App/Enums'

const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const userApiEndPoints = {
  users: '/users',
  account: '/account',
  userById: '/users/:id',
}

export const userRoutes = Route.group(() => {
  Route.group(() => {
    Route[RequestMethods.GET](userApiEndPoints.users, 'UsersController.getAllUsers').middleware('auth')
    Route[RequestMethods.GET](userApiEndPoints.userById, 'UsersController.getUserById').middleware('auth')
    Route[RequestMethods.PATCH](userApiEndPoints.userById, 'UsersController.updateUser').middleware('auth')
    Route[RequestMethods.DELETE](userApiEndPoints.userById, 'UsersController.deleteUser').middleware('auth')

    Route[RequestMethods.POST](userApiEndPoints.users, 'UsersController.createNewUser')
    Route[RequestMethods.GET](userApiEndPoints.account, 'UsersController.getUserAccount').middleware('auth')
    Route[RequestMethods.PATCH](userApiEndPoints.account, 'UsersController.updateUserOwnData').middleware('auth')
    Route[RequestMethods.DELETE](userApiEndPoints.account, 'UsersController.deleteUserByItself').middleware('auth')
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
