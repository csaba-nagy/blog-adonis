import { AUTH_PATH, authApiEndPoints, userApiEndPoints, userProfilesApiEndpoints } from 'App/Routes'
import Env from '@ioc:Adonis/Core/Env'

export const DB_CONNECTION = Env.get('DB_CONNECTION')
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')
const API_PATH = `${API_BASE_ROUTE}/${API_VERSION}`

export const TEST_USER_ID = 1
export const USERS_PATH = `${API_PATH}${userApiEndPoints.users}`

// Users & Profiles by ID
export const USER_PATH_WITH_ID = `${USERS_PATH}/${TEST_USER_ID}`
export const USER_PROFILE_PATH_WITH_ID = `${API_PATH}${userProfilesApiEndpoints.profile}/${TEST_USER_ID}`

// Users & Profiles
export const USER_ACCOUNT_PATH = `${API_PATH}${userApiEndPoints.account}`
export const USER_PROFILE_PATH = `${API_PATH}${userProfilesApiEndpoints.profile}`

// Auth
export const AUTH_LOGIN_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.login}`
export const AUTH_LOGOUT_PATH = `${API_PATH}${AUTH_PATH}${authApiEndPoints.logout}`
