import Database from '@ioc:Adonis/Lucid/Database'
import { DB_CONNECTION } from 'Shared/const'

export const setTransaction = async () => {
  await Database.beginGlobalTransaction(DB_CONNECTION)
  return () => Database.rollbackGlobalTransaction(DB_CONNECTION)
}
