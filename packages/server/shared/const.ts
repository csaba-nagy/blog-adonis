import {
  authApiEndPoints,
  userApiEndPoints,
  userProfilesApiEndpoints,
} from 'App/Routes/const'
import Env from '@ioc:Adonis/Core/Env'

export const DB_CONNECTION = Env.get('DB_CONNECTION')

export const DOMAIN = Env.get('DOMAIN')

export const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
export const API_VERSION = Env.get('API_VERSION')
export const API_PATH = `${API_BASE_ROUTE}/${API_VERSION}` // /api/v1

export const USERS_PATH = '/users'
export const POSTS_PATH = '/posts'
export const AUTH_PATH = '/auth'

export const TEST_ADMIN_ID = 1
export const TEST_AUTHOR_ID = 2
export const TEST_USER_ID = 3

export const USERS_PATH_PREFIX = `${API_PATH}${USERS_PATH}` // /api/v1/users
export const POSTS_PATH_PREFIX = `${API_PATH}${POSTS_PATH}` // /api/v1/posts

export const USER_ACCOUNT_PATH = `${USERS_PATH_PREFIX}${userApiEndPoints.account}` // /api/v1/users/account
export const USER_PROFILE_PATH = `${USERS_PATH_PREFIX}${userProfilesApiEndpoints.profile}` // /api/v1/users/profile

export const USER_ACCOUNT_PATH_WITH_USER_ID = `${USER_ACCOUNT_PATH}/${TEST_USER_ID}` // /api/v1/users/account/3
export const USER_PROFILE_PATH_WITH_USER_ID = `${USER_PROFILE_PATH}/${TEST_USER_ID}` // /api/v1/users/profile/3

export const AUTH_LOGIN_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.login}` // /api/v1/auth/login
export const AUTH_LOGOUT_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.logout}` // /api/v1/auth/logout
