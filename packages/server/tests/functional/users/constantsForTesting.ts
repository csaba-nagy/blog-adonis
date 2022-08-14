import { userApiEndPoints, userProfilesApiEndpoints } from 'App/Routes'
import Env from '@ioc:Adonis/Core/Env'

export const DB_CONNECTION = Env.get('DB_CONNECTION')
const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')
const API_PATH = `${API_BASE_ROUTE}/${API_VERSION}`
export const TEST_USER_ID = 1
export const USERS_PATH = `${API_PATH}${userApiEndPoints.home}`
export const USER_PATH_WITH_ID = `${USERS_PATH}/${TEST_USER_ID}`
export const USER_PROFILE_PATH = `${API_PATH}${userProfilesApiEndpoints.home}`
export const USER_PROFILE_PATH_WITH_ID = `${API_PATH}${userProfilesApiEndpoints.home}/${TEST_USER_ID}`
