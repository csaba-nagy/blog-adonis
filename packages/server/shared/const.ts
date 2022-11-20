import {
  authApiEndPoints,
} from 'App/Routes/const'
import Env from '@ioc:Adonis/Core/Env'

export const DB_CONNECTION = Env.get('DB_CONNECTION')

export const DOMAIN = Env.get('DOMAIN')

export const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
export const API_VERSION = Env.get('API_VERSION')
export const API_PATH = `${API_BASE_ROUTE}/${API_VERSION}` // /api/v1

export const AUTH_PATH = '/auth'

export const TEST_ADMIN_ID = 1
export const TEST_AUTHOR_ID = 2
export const TEST_USER_ID = 3

export const AUTH_LOGIN_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.login}` // /api/v1/auth/login
export const AUTH_LOGOUT_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.logout}` // /api/v1/auth/logout
