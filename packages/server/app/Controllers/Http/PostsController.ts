import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { UserRole } from 'App/Enums'
import { PostsRepository } from 'App/Repositories'
import { PostValidator } from 'App/Validators'
import type { Post } from 'App/Models'

export default class PostsController {
  constructor(private repository = new PostsRepository()) {}

  public store = async ({ auth, bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('PostPolicy').authorize('createPost')

    const validatedPayload = await request.validate(PostValidator)

    const createdPost = await this.repository.createPost({ userId: auth.user!.id, ...validatedPayload })

    return response.created(createdPost)
  }

  public show = async ({ bouncer, request, response }: HttpContextContract) => {
    const post: Post | undefined = (await this.repository.getPostBySlug(request.param('slug')))[0]

    if (!post)
      return response.notFound()

    await bouncer.with('PostPolicy').authorize('getPostBySlug', post)

    return response.ok(post.serialize(this.getPostSerializationOptions('by_slug')))
  }

  public index = async ({ auth, request, response }: HttpContextContract) => {
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const posts = auth.isGuest || auth.user?.role === UserRole.USER
      ? await this.repository.getPublicPosts(page, limit)
      : await this.repository.getAllPostsAsAuthor(auth.user!, page, limit)

    return response.ok(posts.serialize(this.getPostSerializationOptions('all')))
  }

  public update = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToUpdate: Post | undefined = (await this.repository.getPostBySlug(request.param('slug')))[0]

    if (!postToUpdate)
      return response.notFound()

    await bouncer.with('PostPolicy').authorize('updatePost', postToUpdate)

    const validatedPayload = await request.validate(PostValidator)

    const updatedPost = await this.repository.updatePost(postToUpdate, validatedPayload)

    return response.ok(updatedPost.serialize(this.getPostSerializationOptions('by_slug')))
  }

  public destroy = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToDelete: Post | undefined = (await this.repository.getPostBySlug(request.param('slug')))[0]

    if (!postToDelete)
      return response.notFound()

    await bouncer.with('PostPolicy').authorize('deletePost', postToDelete)

    await this.repository.deletePost(postToDelete)

    return response.noContent()
  }

  private getPostSerializationOptions = (method: 'all' | 'by_slug') => {
    const isAll = method === 'all'
    return {
      fields: {
        omit: isAll ? ['user_id'] : ['id', 'user_id', 'created_at'],
      },
      relations: {
        author: {
          fields: isAll
            ? { pick: ['name', 'profile'] }
            : { omit: ['created_at', 'updated_at'] },
        },
      },
    }
  }
}
