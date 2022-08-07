import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserProfile } from '../../app/Models'

export default Factory.define(UserProfile, ({ faker }) => {
  return {
    biography: faker.lorem.paragraph(),
  }
}).build()
