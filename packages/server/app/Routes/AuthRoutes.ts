import Route from '@ioc:Adonis/Core/Route'
import { RequestMethods } from 'App/Enums'
import Env from '@ioc:Adonis/Core/Env'
import { AUTH_PATH } from 'Shared/const'
import { authApiEndPoints } from './const'

const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const authRoutes = Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route[RequestMethods.POST](authApiEndPoints.login, 'AuthController.login')
      Route[RequestMethods.GET](authApiEndPoints.logout, 'AuthController.logout').middleware('auth')
    }).prefix(AUTH_PATH)
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
