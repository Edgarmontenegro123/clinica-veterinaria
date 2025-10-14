import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtectd } from './role-protectd.decorator';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtectd(...roles),
        UseGuards(AuthGuard(), UserRoleGuard),
    );
}