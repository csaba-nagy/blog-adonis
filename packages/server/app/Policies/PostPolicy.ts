import { action } from '@ioc:Adonis/Addons/Bouncer'
import { PostState, UserRole } from 'App/Enums'
import type { Post, User } from 'App/Models'
import BasePolicy from 'App/Policies/BasePolicy'

export default class PostPolicy extends BasePolicy {
  public createPost = async (user: User) => user.role === UserRole.AUTHOR

  @action({ allowGuest: true })
  public getPostBySlug = async (user: User | null, post: Post) => {
      if (post.state === PostState.PUBLIC)
        return true

      if (!user)
        return false

      return post.authorId === user.id
    }

  public updatePost = async (user: User, post: Post) =>
    post.state !== PostState.PUBLIC && post.authorId === user.id

  public deletePost = async (user: User, post: Post) =>
    post.state !== PostState.PUBLIC && post.authorId === user.id
}
