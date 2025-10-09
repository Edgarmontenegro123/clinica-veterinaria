import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const client = req.user;

        if (!client)
            throw new InternalServerErrorException('User not found (request)')


        return !data
            ? client
            : client[data]

    }
);