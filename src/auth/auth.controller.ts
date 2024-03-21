import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  GetUserByJWTRequest,
  GetUserByJWTResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateRequest,
  ValidateResponse,
} from './auth.pb';
import { AuthService } from './services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
  private async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  private login(payload: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'GetUserByJWT')
  private async getUserByJwt(
    payload: GetUserByJWTRequest,
  ): Promise<GetUserByJWTResponse> {
    return this.authService.getUserByJWT(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  private validate(payload: ValidateRequest): Promise<ValidateResponse> {
    return this.authService.validate(payload);
  }
}
