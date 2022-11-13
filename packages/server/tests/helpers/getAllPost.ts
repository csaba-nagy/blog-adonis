import type { Post, User } from 'App/Models'
import type { ApiClient } from '@japa/api-client'
import Route from '@ioc:Adonis/Core/Route'

export const getAllPost = async (
  client: ApiClient,
  loggedUser: User | null = null,
  nextPageUrl = '/?page=1',
  posts: Post[] = []) => {
  const path = Route.makeUrl('posts.index')
  const response = !loggedUser
    ? await client.get(`${path}${nextPageUrl}`)
    : await client.get(`${path}${nextPageUrl}`).loginAs(loggedUser)

  const { meta, data } = response.body()
  const { next_page_url } = meta

  posts = [...posts, ...data]

  return !next_page_url ? posts : getAllPost(client, loggedUser, next_page_url, posts)
}
