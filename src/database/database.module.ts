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
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Role, Section, Permission],
        // synchronize: true,
        logging: false,
        autoLoadEntities: true,
        ssl: true,
        // extra: {
        //   ssl: {
        //     rejectUnauthorized: false,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, Section, Permission]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
