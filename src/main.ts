import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { AUTH_PACKAGE_NAME } from './auth/auth.pb';
async function bootstrap() {
  const microServiceOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: AUTH_PACKAGE_NAME,
      protoPath: join('node_modules/grpc-proto/proto/auth.proto'),
    },
  };
  const microservice = await NestFactory.createMicroservice(
    AppModule,
    microServiceOptions,
  );
  microservice.useGlobalPipes(new ValidationPipe());
  await microservice.listen();
}
bootstrap();
