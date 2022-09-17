// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { PostsRepository } from 'App/Repositories'

export default class PostsController {
  constructor(private repository = new PostsRepository()) {}

  public createPost = async () => {
    return await this.repository.createPost()
  }

  public getPost = async () => {
    return await this.repository.getPost()
  }

  public getAllPosts = async () => {
    return await this.repository.getAllPosts()
  }

  public updatePost = async () => {
    return await this.repository.updatePost()
  }

  public deletePost = async () => {
    return await this.repository.deletePost()
  }
}
