import Env from '@ioc:Adonis/Core/Env'

const API_BASE_ROUTE = Env.get('API_BASE_ROUTE')
const API_VERSION = Env.get('API_VERSION')

export const ROUTE_PREFIX = `${API_BASE_ROUTE}/${API_VERSION}`
