import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    // Provide a definite string for secretOrKey (fallback if undefined)
    const secretKey: string =
      config.get<string>("JWT_SECRET") || "fallbackSecret";

    // Use StrategyOptionsWithoutRequest if we do NOT want req in validate()
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    };

    super(options);
  }

  async validate(payload: any) {
    // payload.sub is typically the user ID
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      return null; // or throw an UnauthorizedException
    }
    return user; // attaches to req.user
  }
}
