import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity';
import { Profile } from './profile.entity';

@Module({
  // hay que definir que entidad de typeorm vamos a usar
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // exporto el servicio de usuario. Lo utliza 'Post'
})
export class UsersModule {}
