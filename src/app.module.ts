import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ClassroomModule } from './classroom/classroom.module';
import { InventariModule } from './inventari/inventari.module';
import { InventariTypeModule } from './inventari_type/inventari_type.module';
import { IssuesModule } from './issues/issues.module';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IssuesConversationModule } from './issues_conversation/issues_conversation.module';
import { Inventari_type } from './inventari_type/inventari_type.entity';
import { User } from './users/users.entity';
import { Issue } from './issues/issues.entity';
import { Classroom } from './classroom/classroom.entity';
import { Inventari } from './inventari/inventari.entity';
import { IssueConversationEntity } from './issues_conversation/issues_conversation.entity';
import { Status } from './status/status.entity';
import { AuthorizationMiddleware } from './authorization.middleware';
import StatusModule from './status/status.module';
import { AuthService } from './Autentication/auth.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClassroomModule,
    InventariTypeModule,
    IssuesModule,
    UsersModule,
    StatusModule,
    InventariModule,
    UtilsModule,
    IssuesConversationModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'database',
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          Classroom,
          Issue,
          Inventari_type,
          IssueConversationEntity,
          User,
          Inventari,
          Status,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [AuthorizationMiddleware, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .exclude({ path: 'users/login', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
