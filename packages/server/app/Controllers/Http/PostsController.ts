import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { PostState, StatusCodes, UserRole } from 'App/Enums'
import { PostsRepository } from 'App/Repositories'
import { CreatePostValidator, UpdatePostValidator } from 'App/Validators'
import { DateTime } from 'luxon'

export default class PostsController {
  constructor(private repository = new PostsRepository()) {}

  public createPost = async ({ auth, bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('PostPolicy').authorize('createPost')

    const validatedPayload = await request.validate(CreatePostValidator)

    const createdPost = await this.repository.createPost({ authorId: auth.user!.id, ...validatedPayload })

    return response.created(createdPost)
  }

  public getPostBySlug = async ({ bouncer, request, response }: HttpContextContract) => {
    const post = await this.repository.getPostBySlug(request.param('slug'))

    await bouncer.with('PostPolicy').authorize('getPostBySlug', post)

    return response.ok(post)
  }

  public getPosts = async ({ auth, response }: HttpContextContract) => {
    return auth.isGuest || auth.user?.role === UserRole.USER
      ? response.ok(await this.repository.getPublicPosts())
      : response.ok(await this.repository.getAllPostsAsAuthor(auth.user!))
  }

  public updatePost = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToUpdate = await this.repository.getPostBySlug(request.param('slug'))

    await bouncer.with('PostPolicy').authorize('updatePost', postToUpdate)

    const validatedPayload = await request.validate(UpdatePostValidator)

    const updatedPost = await this.repository.updatePost(postToUpdate, validatedPayload)

    return response.ok(updatedPost)
  }

  public deletePost = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToDelete = await this.repository.getPostBySlug(request.param('slug'))

    await bouncer.with('PostPolicy').authorize('deletePost', postToDelete)

    await this.repository.deletePost(postToDelete)

    return response.status(StatusCodes.OK)
  }

  public publishPost = async ({ bouncer, request, response }: HttpContextContract) => {
    const postToPublish = await this.repository.getPostBySlug(request.param('slug'))

    await bouncer.with('PostPolicy').authorize('publishPost', postToPublish)

    const payload = { state: PostState.PUBLIC, publishedAt: DateTime.now() }

    const publishedPost = await this.repository.updatePost(postToPublish, payload)

    return response.ok(publishedPost)
  }
}
