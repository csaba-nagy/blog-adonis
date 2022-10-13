import Route from '@ioc:Adonis/Core/Route'
import { RequestMethods } from 'App/Enums'
import { API_BASE_ROUTE, API_VERSION, POSTS_PATH } from 'Shared/const'
import { postApiEndPoints } from './const'

export const postRoutes = Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route[RequestMethods.GET](postApiEndPoints.posts, 'PostsController.getPosts')
      Route[RequestMethods.GET](postApiEndPoints.postBySlug, 'PostsController.getPostBySlug')
      Route[RequestMethods.POST](postApiEndPoints.posts, 'PostsController.createPost').middleware('auth')
      Route[RequestMethods.PATCH](postApiEndPoints.postBySlug, 'PostsController.updatePost').middleware('auth')
      Route[RequestMethods.DELETE](postApiEndPoints.postBySlug, 'PostsController.deletePost').middleware('auth')
      Route[RequestMethods.PATCH](postApiEndPoints.publish, 'PostsController.publishPost').middleware('auth')
    }).prefix(POSTS_PATH)
  }).prefix(API_VERSION)
}).prefix(API_BASE_ROUTE)
