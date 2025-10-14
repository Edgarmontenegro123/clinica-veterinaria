import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Client } from 'src/auth/entities/client.entity';
import { META_ROLES } from '../decorators/role-protectd.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private reflector: Reflector

  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
    
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;
    
    const req = context.switchToHttp().getRequest();
    const user = req.user as Client;
    
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true
      }
    }

    throw new ForbiddenException(`User ${user.name} is need a valid role [${validRoles}]`)
  }
}
