import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    private readonly secret = process.env.JWT_SECRET;

    async generateToken(payload: Record<string, any>): Promise<string> {
        return jwt.sign(payload, this.secret);
    }
}