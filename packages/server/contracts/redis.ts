/**
 * Contract source: https://git.io/JemcN
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import type { InferConnectionsFromConfig } from '@adonisjs/redis/build/config'
import type redisConfig from '../config/redis'

declare module '@ioc:Adonis/Addons/Redis' {
  interface RedisConnectionsList extends InferConnectionsFromConfig<typeof redisConfig> {}
}
