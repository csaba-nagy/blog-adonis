import type { User } from 'App/Models'
import type { ApiClient } from '@japa/api-client'
import Route from '@ioc:Adonis/Core/Route'

export const getAllUsers = async (
  client: ApiClient,
  loggedUser: User | null = null,
  nextPageUrl = '/?page=1',
  users: User[] = [],
) => {
  const path = Route.makeUrl('users.index')

  const response = !loggedUser
    ? await client.get(`${path}${nextPageUrl}`)
    : await client.get(`${path}${nextPageUrl}`).loginAs(loggedUser)

  const { meta, data } = response.body()
  const { nextPageUrl: nextPage } = meta

  return !nextPage ? users : getAllUsers(client, loggedUser, nextPage, [...users, ...data])
}
