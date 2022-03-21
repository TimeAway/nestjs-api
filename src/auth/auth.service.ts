import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { use } from 'passport';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  /**
   * 用户注册
   * @param dto
   */
  async signup(dto: AuthDto) {
    try {
      // 1.generate the password hash
      const passwordHash = await hash(dto.password);
      // 2. save the new use in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: passwordHash,
        },
      });
      // 3. filter hash filename
      delete user.hash;
      // 4. return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  /**
   * 用户登陆
   */
  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist, throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // or, compare password
    const pwMatches = await verify(user.hash, dto.password);
    // if password incorrect, throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // every thing is ok, send back the user
    delete user.hash;
    return user;
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: '',
    });
  }
}
