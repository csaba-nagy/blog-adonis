import Factory from '@ioc:Adonis/Lucid/Factory'
import { Post } from 'App/Models'
import { PostCategory, PostState } from 'App/Enums'

export default Factory.define(Post, ({ faker }) => {
  return {
    pageTitle: faker.lorem.sentence(),
    title: faker.lorem.sentence(),
    userId: 1,
    category: PostCategory.AFK,
    description: faker.lorem.paragraph(),
    metaDescription: faker.lorem.paragraph(),
    body: faker.lorem.text(),
  }
})
  .state('category.web_development', post => post.category = PostCategory.WEB_DEVELOPMENT)
  .state('state.public', post => post.state = PostState.PUBLIC)
  .build()
