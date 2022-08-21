import { AuthController } from 'App/Controllers/Http'
import Route from '@ioc:Adonis/Core/Route'
import { RequestMethods } from 'App/Enums'
import Env from '@ioc:Adonis/Core/Env'

const authController = new AuthController()
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')
const AUTH_PATH = '/auth'

export const authApiEndPoints = {
  login: '/login',
  logout: '/logout',
}
export const authRoutes = Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route[RequestMethods.POST](authApiEndPoints.login, authController.login)
      Route[RequestMethods.GET](authApiEndPoints.logout, authController.logout).middleware('auth')
    }).prefix(AUTH_PATH)
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
