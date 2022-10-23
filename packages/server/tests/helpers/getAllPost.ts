import type { Post, User } from 'App/Models'
import { POSTS_PATH_PREFIX } from 'Shared/const'
import type { ApiClient } from '@japa/api-client'

export const getAllPost = async (
  client: ApiClient,
  loggedUser: User | null = null,
  nextPageUrl = '/?page=1',
  posts: Post[] = []) => {
  const response = !loggedUser
    ? await client.get(`${POSTS_PATH_PREFIX}${nextPageUrl}`)
    : await client.get(`${POSTS_PATH_PREFIX}${nextPageUrl}`).loginAs(loggedUser)

  const { meta, data } = response.body()
  const { next_page_url } = meta

  posts = [...posts, ...data]

  return !next_page_url ? posts : getAllPost(client, loggedUser, next_page_url, posts)
}
