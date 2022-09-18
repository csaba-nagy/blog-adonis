import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusCodes } from 'App/Enums'

import { PostsRepository } from 'App/Repositories'

export default class PostsController {
  constructor(private repository = new PostsRepository()) {}

  public createPost = async ({ request, response }: HttpContextContract) => {
    const createdPost = await this.repository.createPost(request.body())

    return response.created(createdPost)
  }

  public getPostBySlug = async ({ request, response }: HttpContextContract) => {
    const post = await this.repository.getPostBySlug(request.param('slug'))

    return response.ok(post)
  }

  public getPublicPosts = async ({ response }: HttpContextContract) => {
    const posts = await this.repository.getPublicPosts()

    return response.ok(posts)
  }

  public updatePost = async ({ request, response }: HttpContextContract) => {
    const payload = {
      slug: request.param('slug'),
      ...request.body(),
    }

    const updatedPost = await this.repository.updatePost(payload)

    return response.ok(updatedPost)
  }

  public deletePost = async ({ request, response }: HttpContextContract) => {
    await this.repository.deletePost(request.param('slug'))

    return response.status(StatusCodes.OK)
  }
}
