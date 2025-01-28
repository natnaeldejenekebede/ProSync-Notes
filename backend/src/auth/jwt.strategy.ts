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
/**
 * Strategy for handling JWT-based authentication
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for the JwtStrategy
   *
   * @param authService The AuthService instance
   * @param config The ConfigService instance
   */
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

  /**
   * Validates the payload of the JWT
   *
   * @param payload The payload of the JWT
   */
  async validate(payload: any) {
    // payload.sub is the user ID
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      return null; // or throw an UnauthorizedException
    }

    return user; // attaches to req.user
  }
}
