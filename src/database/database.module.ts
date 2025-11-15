import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/db/entities/user.entity';
import { Role } from 'src/db/entities/role.entity';
import { Section } from 'src/db/entities/section.entity';
import { Permission } from 'src/db/entities/permission.entity';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'arun@9655'),
        database: configService.get('DB_NAME', 'nest_auth'),
        entities: [User, Role, Section, Permission],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, Section, Permission]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
