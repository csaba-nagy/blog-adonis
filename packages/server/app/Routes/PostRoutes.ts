import Route from '@ioc:Adonis/Core/Route'
import { RequestMethods } from 'App/Enums'
import { API_BASE_ROUTE, API_VERSION, POSTS_PATH } from './constants'

export const postApiEndPoints = {
  posts: '/',
  postBySlug: '/:slug',
}

export const postRoutes = Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route[RequestMethods.GET](postApiEndPoints.posts, 'PostsController.getPublicPosts')
      Route[RequestMethods.GET](postApiEndPoints.postBySlug, 'PostsController.getPostBySlug')
      Route[RequestMethods.POST](postApiEndPoints.posts, 'PostsController.createPost')
      Route[RequestMethods.PATCH](postApiEndPoints.postBySlug, 'PostsController.updatePost')
      Route[RequestMethods.DELETE](postApiEndPoints.postBySlug, 'PostsController.deletePost')
    }).prefix(POSTS_PATH)
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
