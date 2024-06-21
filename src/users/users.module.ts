import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'src/common/loggin.interceptor';
import { AppGateway } from 'src/app/app.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
  controllers: [UsersController],
  providers: [AppGateway, UsersService,  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },],
  exports: [UsersService]
})
export class UsersModule {}
