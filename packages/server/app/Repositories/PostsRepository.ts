import Database from '@ioc:Adonis/Lucid/Database'
import { PostState } from 'App/Enums'
import { Post } from 'App/Models'

export default class PostsRepository {
  public getPublicPosts = async () => {
    return await Post.query({ client: await Database.transaction() })
      .select('title', 'slug', 'category', 'description', 'author_id', 'updated_at')
      .where('state', '=', PostState.PUBLIC)
      .orderBy('updated_at', 'desc')
  }

  public getPostBySlug = async (slug: string) =>
    await Post.findByOrFail('slug', slug)

  public createPost = async (payload) => {
    return await Database.transaction(async (trx) => {
      return await Post.create(payload, { client: trx })
    })
  }

  public updatePost = async (payload) => {
    return await Database.transaction(async (trx) => {
      const originalPost = await Post.findByOrFail('slug', payload.slug, { client: trx })

      return await originalPost.merge(payload).save()
    })
  }

  public deletePost = async (slug: string) => {
    await Database.transaction(async (trx) => {
      const post = await Post.findByOrFail('slug', slug, { client: trx })

      await post.delete()
    })
  }
}
