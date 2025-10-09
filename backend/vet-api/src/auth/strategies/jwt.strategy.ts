import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { envs } from "src/config/envs";
import { Client } from "../entities/client.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,

    ) {
        super({
            secretOrKey: envs.jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }


    async validate(payload: JwtPayload): Promise<Client> {

        const { id } = payload;

        const client = await this.clientRepository.findOneBy({ id });

        if (!client)
            throw new UnauthorizedException('token not valid')

        return client;
    }
}