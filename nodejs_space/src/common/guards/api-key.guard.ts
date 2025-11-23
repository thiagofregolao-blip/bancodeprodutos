
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: apiKey as string },
    });

    if (!keyRecord || !keyRecord.isActive) {
      throw new UnauthorizedException('Invalid or inactive API key');
    }

    // Check if admin access is required
    const requiresAdmin = this.reflector.get<boolean>(
      'requiresAdmin',
      context.getHandler(),
    );

    if (requiresAdmin && !keyRecord.isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }

    // Attach the API key info to the request
    request.apiKey = keyRecord;

    return true;
  }
}
