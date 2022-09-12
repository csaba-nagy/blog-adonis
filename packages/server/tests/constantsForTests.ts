import { AUTH_PATH, USERS_PATH, authApiEndPoints, userApiEndPoints, userProfilesApiEndpoints } from 'App/Routes'
import Env from '@ioc:Adonis/Core/Env'

export const DB_CONNECTION = Env.get('DB_CONNECTION')
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')
const API_PATH = `${API_BASE_ROUTE}/${API_VERSION}` // /api/v1

export const TEST_ADMIN_ID = 1
export const USERS_PATH_PREFIX = `${API_PATH}${USERS_PATH}` // /api/v1/users
export const USER_ACCOUNT_PATH = `${USERS_PATH_PREFIX}${userApiEndPoints.account}` // /api/v1/users/account
export const USER_PROFILE_PATH = `${USERS_PATH_PREFIX}${userProfilesApiEndpoints.profile}` // /api/v1/users/profile

export const USER_ACCOUNT_PATH_WITH_ID = `${USER_ACCOUNT_PATH}/${TEST_ADMIN_ID}` // /api/v1/users/account/1
export const USER_PROFILE_PATH_WITH_ID = `${USER_PROFILE_PATH}/${TEST_ADMIN_ID}` // /api/v1/users/profile/1

export const AUTH_LOGIN_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.login}` // /api/v1/auth/login
export const AUTH_LOGOUT_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.logout}` // /api/v1/auth/logout
