import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppGateway } from './app/app.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/logger.middleware';

@Module({
  imports: [UsersModule, MongooseModule.forRoot('mongodb://localhost/nest'), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }), AuthModule,],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');
  }
}
