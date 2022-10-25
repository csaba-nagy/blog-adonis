import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserRole, UserStatus } from 'App/Enums'
import { User } from 'App/Models'

import PostFactory from './PostFactory'
import UserProfileFactory from './UserProfileFactory'

export default Factory
  .define(User, ({ faker }) => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: '!Password11',
  }))

  // With state method, we can set the model properties
  // with custom values instead of the default
  .state('status.active', user => user.status = UserStatus.ACTIVE)
  .state('status.suspended', user => user.status = UserStatus.SUSPENDED)
  .state('role.admin', user => user.role = UserRole.ADMIN)
  .state('role.author', user => user.role = UserRole.AUTHOR)

  // With relation method, we can set the relation between the models,
  // so when the factory method is executed the related factory method will be executed as well
  .relation('profile', () => UserProfileFactory)
  .relation('posts', () => PostFactory)
  .build()
