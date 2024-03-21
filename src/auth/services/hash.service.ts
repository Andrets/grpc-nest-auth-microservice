import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  HASH_SERVICE_NAME,
  HashPasswordRequest,
  HashPasswordResponse,
  HashServiceClient,
  ValidatePasswordRequest,
  ValidatePasswordResponse,
} from '../../hash/hash.pb';

@Injectable()
export class HashService implements OnModuleInit {
  constructor(
    @Inject(HASH_SERVICE_NAME) private service: HashServiceClient,
    @Inject(HASH_SERVICE_NAME) private client: ClientGrpc,
  ) {}

  public async onModuleInit() {
    this.service = this.client.getService<HashServiceClient>(HASH_SERVICE_NAME);
  }

  public async hash(
    payload: HashPasswordRequest,
  ): Promise<HashPasswordResponse> {
    return firstValueFrom(this.service.hashPassword(payload));
  }

  public async validatePasswords(
    payload: ValidatePasswordRequest,
  ): Promise<ValidatePasswordResponse> {
    return firstValueFrom(this.service.validatePassword(payload));
  }
}
