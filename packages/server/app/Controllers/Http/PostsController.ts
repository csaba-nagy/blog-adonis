import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { PostState, StatusCodes, UserRole } from 'App/Enums'
import { PostsRepository } from 'App/Repositories'
import { CreatePostValidator, UpdatePostValidator } from 'App/Validators'
import { DateTime } from 'luxon'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import type { Post } from 'App/Models'

export default class PostsController {
  constructor(private repository = new PostsRepository()) {}

  public createPost = async ({ auth, bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('PostPolicy').authorize('createPost')

    const validatedPayload = await request.validate(CreatePostValidator)

    const createdPost = await this.repository.createPost({ userId: auth.user!.id, ...validatedPayload })

    return response.created(createdPost)
  }

  public getPostBySlug = async ({ bouncer, request, response }: HttpContextContract) => {
    const post: Post | undefined = (await this.repository.getPostBySlug(request.param('slug')))[0]

    if (!post)
      return response.notFound()

    await bouncer.with('PostPolicy').authorize('getPostBySlug', post)

    return response.ok(post.serialize(this.getPostSerializationOptions('by_slug')))
  }

  public getPosts = async ({ auth, response }: HttpContextContract) => {
    const posts = auth.isGuest || auth.user?.role === UserRole.USER
      ? await this.repository.getPublicPosts()
      : await this.repository.getAllPostsAsAuthor(auth.user!)

    return response.ok(posts.map(post => post.serialize(this.getPostSerializationOptions('all'))))
  }

  public updatePost = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToUpdate: Post | undefined = (await this.repository.getPostBySlug(request.param('slug')))[0]

    if (!postToUpdate)
      return response.notFound()

    await bouncer.with('PostPolicy').authorize('updatePost', postToUpdate)

    const validatedPayload = await request.validate(UpdatePostValidator)

    const updatedPost = await this.repository.updatePost(postToUpdate, validatedPayload)

    return response.ok(updatedPost.serialize(this.getPostSerializationOptions('by_slug')))
  }

  public deletePost = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToDelete: Post | undefined = (await this.repository.getPostBySlug(request.param('slug')))[0]

    if (!postToDelete)
      return response.notFound()

    await bouncer.with('PostPolicy').authorize('deletePost', postToDelete)

    await this.repository.deletePost(postToDelete)

    return response.status(StatusCodes.OK)
  }

  public publishPost = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToPublish: Post | undefined = (await this.repository.getPostBySlug(request.param('slug')))[0]

    if (!postToPublish)
      return response.notFound()

    await bouncer.with('PostPolicy').authorize('publishPost', postToPublish)

    const payload = { state: PostState.PUBLIC, publishedAt: DateTime.now() }

    await validator.validate({
      schema: schema.create({
        state: schema.enum(Object.values(PostState)),
        publishedAt: schema.date(),
      }),
      data: payload,
    })

    const publishedPost = await this.repository.updatePost(postToPublish, payload)

    return response.ok(publishedPost.serialize(this.getPostSerializationOptions('by_slug')))
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
