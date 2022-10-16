import Database from '@ioc:Adonis/Lucid/Database'
import type { User } from 'App/Models'
import { Post } from 'App/Models'

export default class PostsRepository {
  private selectFields = (
    requestedData: string[] = ['title', 'slug', 'state', 'category', 'description', 'user_id', 'published_at'],
  ) => Post.query().select(...requestedData)

  public getPublicPosts = () =>
    Database.transaction(trx =>
      this.selectFields().useTransaction(trx).withScopes(scopes => scopes.published()).preload('user'))

  public getAllPostsAsAuthor = (author: User) =>
    Database.transaction(trx =>
      this.selectFields().useTransaction(trx).withScopes(scopes => scopes.visibleTo(author)).preload('user'))

  public getPostBySlug = async (slug: string) => Post.query().where('slug', '=', slug).preload('user')

  public createPost = payload =>
    Database.transaction(trx => Post.create(payload, { client: trx }))

  public updatePost = (post: Post, payload) =>
    Database.transaction(trx => post.useTransaction(trx).merge(payload).save())

  public deletePost = (post: Post) =>
    Database.transaction(trx => post.useTransaction(trx).delete())
}
