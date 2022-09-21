import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusCodes, UserRole } from 'App/Enums'

import { PostsRepository } from 'App/Repositories'

export default class PostsController {
  constructor(private repository = new PostsRepository()) {}

  public createPost = async ({ bouncer, request, response }: HttpContextContract) => {
    await bouncer.with('PostPolicy').authorize('createPost')

    const createdPost = await this.repository.createPost(request.body())

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
      : response.ok(await this.repository.getAllPostsFromAuthors(auth.user!))
  }

  public updatePost = async ({ bouncer, request, response }: HttpContextContract) => {
    const post = await this.repository.getPostBySlug(request.param('slug'))

    await bouncer.with('PostPolicy').authorize('updatePost', post)

    const payload = {
      slug: request.param('slug'),
      ...request.body(),
    }

    const updatedPost = await this.repository.updatePost(payload)

    return response.ok(updatedPost)
  }

  public deletePost = async ({ bouncer, request, response }: HttpContextContract) => {
    const post = await this.repository.getPostBySlug(request.param('slug'))

    await bouncer.with('PostPolicy').authorize('deletePost', post)

    await this.repository.deletePost(request.param('slug'))

    return response.status(StatusCodes.OK)
  }
}
