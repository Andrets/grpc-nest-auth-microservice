import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { HashService } from 'src/auth/services/hash.service';
import { HASH_SERVICE_NAME, HASH_V1_PACKAGE_NAME } from 'src/hash/hash.pb';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: HASH_SERVICE_NAME,
        useFactory: async (
          configService: ConfigService,
        ): Promise<GrpcOptions> => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('GRPC_URL'),
            package: HASH_V1_PACKAGE_NAME,
            protoPath: 'node_modules/grpc-proto/proto/hash.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, HashService],
})
export class AuthModule {}
