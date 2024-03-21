/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "hash_v1";

export interface HashPasswordRequest {
  password: string;
}

export interface HashPasswordResponse {
  hashedpassword: string;
}

export interface ValidatePasswordRequest {
  password: string;
  hashedpassword: string;
}

export interface ValidatePasswordResponse {
  isValid: boolean;
}

export const HASH_V1_PACKAGE_NAME = "hash_v1";

export interface HashServiceClient {
  hashPassword(request: HashPasswordRequest): Observable<HashPasswordResponse>;

  validatePassword(request: ValidatePasswordRequest): Observable<ValidatePasswordResponse>;
}

export interface HashServiceController {
  hashPassword(
    request: HashPasswordRequest,
  ): Promise<HashPasswordResponse> | Observable<HashPasswordResponse> | HashPasswordResponse;

  validatePassword(
    request: ValidatePasswordRequest,
  ): Promise<ValidatePasswordResponse> | Observable<ValidatePasswordResponse> | ValidatePasswordResponse;
}

export function HashServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["hashPassword", "validatePassword"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("HashService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("HashService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HASH_SERVICE_NAME = "HashService";
