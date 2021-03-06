import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { AuthService } from '../modules/auth/auth.service';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization;
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      await this.authService.checkIsValidAuth(payload.id, token);
      await this.authService.checkIsValidUser(payload.id);

      const requiredRole = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRole) {
        return true;
      }

      return requiredRole.includes(payload['role']);
    } catch (e) {
      throw new ForbiddenException(`No access: ${e.message}`);
    }
  }
}
