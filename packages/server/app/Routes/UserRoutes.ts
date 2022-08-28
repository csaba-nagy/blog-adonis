import Route from '@ioc:Adonis/Core/Route'
import { UsersController } from 'App/Controllers/Http'
import Env from '@ioc:Adonis/Core/Env'
import { RequestMethods } from 'App/Enums'

const usersController = new UsersController()
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const userApiEndPoints = {
  users: '/users',
  account: '/account',
  userById: '/users/:id',
}

/*
|-------------------------------------------------------------------------------
| Grouping Routes
|-------------------------------------------------------------------------------
|
| In this case there is not necessarily need to nesting the group statements,
| but if the v2 API is developed in future,
| it will be handy to provide the v1 routes as well
|
*/

export const userRoutes = Route.group(() => {
  Route.group(() => {
    // TODO:Admin only
    Route[RequestMethods.GET](userApiEndPoints.users, usersController.getAllUsers).middleware('auth')
    Route[RequestMethods.GET](userApiEndPoints.userById, usersController.getUserById).middleware('auth')
    Route[RequestMethods.PATCH](userApiEndPoints.userById, usersController.updateUser).middleware('auth')
    Route[RequestMethods.DELETE](userApiEndPoints.userById, usersController.deleteUser).middleware('auth')

    // For users
    Route[RequestMethods.POST](userApiEndPoints.users, usersController.createNewUser)
    Route[RequestMethods.GET](userApiEndPoints.account, usersController.getUserAccount).middleware('auth')
    Route[RequestMethods.PATCH](userApiEndPoints.account, usersController.updateUserOwnData).middleware('auth')
    Route[RequestMethods.DELETE](userApiEndPoints.account, usersController.deleteUserByItself).middleware('auth')
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
