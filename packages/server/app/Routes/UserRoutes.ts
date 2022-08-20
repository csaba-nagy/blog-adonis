import Route from '@ioc:Adonis/Core/Route'
import { UsersController } from 'App/Controllers/Http'
import Env from '@ioc:Adonis/Core/Env'
import { RequestMethods } from 'App/Enums'

const usersController = new UsersController()
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const userApiEndPoints = {
  home: '/users',
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
    Route[RequestMethods.GET](userApiEndPoints.home, usersController.getAllUsers).middleware('auth')
    Route[RequestMethods.GET](userApiEndPoints.userById, usersController.getUserById).middleware('auth')
    Route[RequestMethods.POST](userApiEndPoints.home, usersController.createNewUser)
    Route[RequestMethods.PATCH](userApiEndPoints.userById, usersController.updateUser).middleware('auth')
    Route[RequestMethods.DELETE](userApiEndPoints.userById, usersController.deleteUser).middleware('auth')
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
