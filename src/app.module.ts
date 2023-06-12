import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'nestdb',
      autoLoadEntities: true,
      synchronize:true,
      logging:true,
      entities: ["dist/**/**.entity{.ts,.js}"]
      
    }), 
    UsersModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


