import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { HashService } from 'src/auth/services/hash.service';
import { PrismaService } from 'src/prisma.service';
import {
  GetUserByJWTRequest,
  GetUserByJWTResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateRequest,
  ValidateResponse,
} from '../auth.pb';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.userService.findOneByEmailOrUsername(payload.email);
    if (user) {
      throw new RpcException('User already exists');
    }
    const hashedPassword = await this.hashService.hash({
      password: payload.password,
    });
    console.log(hashedPassword);
    const newUser = await this.prismaClient.user.create({
      data: {
        name: payload.username,
        password: hashedPassword.hashedpassword,
        email: payload.email,
        updatedAt: new Date(),
      },
    });
    if (!newUser) {
      throw new RpcException('Failed to create user');
    }
    return {
      registered: true,
    };
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findOneByEmailOrUsername(
      payload.username,
    );
    if (!user) {
      throw new RpcException('User not found');
    }
    const validatePassword = await this.hashService.validatePasswords({
      password: payload.password,
      hashedpassword: user.password,
    });
    console.log(validatePassword);
    if (validatePassword.isValid != true) {
      throw new RpcException('Invalid password');
    }
    return {
      token: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };
  }

  async getUserByJWT(
    payload: GetUserByJWTRequest,
  ): Promise<GetUserByJWTResponse> {
    const userInfo = this.jwtService.decode(payload.jwtToken);
    console.log(userInfo);
    const user = await this.userService.findOneById(userInfo.id);
    if (!user) {
      throw new RpcException('User not found');
    }
    return {
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async validate(payload: ValidateRequest): Promise<ValidateResponse> {
    const validOrNot = await this.jwtService.verify(payload.token);
    return {
      valid: validOrNot,
    };
  }
}
