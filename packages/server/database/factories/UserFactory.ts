import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserRole, UserStatus } from '../../app/Enums'
import { User } from '../../app/Models'
import PostFactory from './PostFactory'
import UserProfileFactory from './UserProfileFactory'

export default Factory.define(User, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'verysafepassword',
  }
})
  // With state method, we can set the model properties
  // with custom values instead of the default
  .state('status', user => user.status = UserStatus.ACTIVE)
  .state('role', user => user.role = UserRole.AUTHOR)

  // With relation method, we can set the relation between the models,
  // so when the factory method is executed the related factory method will be executed as well
  .relation('profile', () => UserProfileFactory)
  .relation('posts', () => PostFactory)
  .build()
