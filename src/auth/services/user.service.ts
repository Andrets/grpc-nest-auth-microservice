import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | false> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: emailOrUsername,
          },
          {
            name: emailOrUsername,
          },
        ],
      },
    });
    if (user) {
      return user;
    }
    return false;
  }

  async findOneById(id: number): Promise<User | false> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    }
    return false;
  }
}
