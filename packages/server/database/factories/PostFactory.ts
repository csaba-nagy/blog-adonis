import Factory from '@ioc:Adonis/Lucid/Factory'
import { Post } from 'App/Models'
import { PostCategory } from 'App/Enums'

export default Factory.define(Post, ({ faker }) => {
  return {
    pageTitle: faker.lorem.sentence(),
    title: faker.lorem.sentence(),
    category: PostCategory.WEB_DEVELOPMENT,
    authorId: 1,
    description: faker.lorem.paragraph(),
    metaDescription: faker.lorem.paragraph(),
    body: faker.lorem.text(),
  }
}).build()
